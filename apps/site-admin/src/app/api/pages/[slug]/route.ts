import { NextResponse } from "next/server";

const isStatic = process.env.NEXT_PUBLIC_STATIC === "1";

// ── File helpers ─────────────────────────────────────────────────────────────

const MIME_TO_EXT: Record<string, string> = {
  "image/png": ".png", "image/jpeg": ".jpg", "image/jpg": ".jpg",
  "image/webp": ".webp", "image/svg+xml": ".svg", "image/gif": ".gif",
  "audio/mpeg": ".mp3", "audio/mp3": ".mp3", "audio/wav": ".wav",
  "audio/ogg": ".ogg", "audio/mp4": ".m4a", "audio/x-m4a": ".m4a",
  "audio/webm": ".webm",
};

const IMAGE_EXTS = [".svg", ".png", ".jpg", ".jpeg", ".webp", ".gif"];
const AUDIO_EXTS = [".mp3", ".wav", ".ogg", ".m4a", ".webm"];

function parseDataUrl(dataUrl: string): { ext: string; buffer: Buffer } | null {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  const ext = MIME_TO_EXT[match[1]] || null;
  if (!ext) return null;
  return { ext, buffer: Buffer.from(match[2], "base64") };
}

/**
 * Delete all files matching `{basePath}{ext}` for given extensions.
 */
function deleteExisting(
  fs: typeof import("fs"),
  basePath: string,
  extensions: string[],
) {
  for (const ext of extensions) {
    const fp = basePath + ext;
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
  }
}

/**
 * Save a base64 data URL as a file. Returns the public URL path.
 * Deletes any previous file for the same role (cover, about, audio).
 */
function saveAsset(
  fs: typeof import("fs"),
  path: typeof import("path"),
  sitePublicDir: string,
  category: string,
  slug: string,
  role: string,
  dataUrl: string,
): string | null {
  const parsed = parseDataUrl(dataUrl);
  if (!parsed) return null;

  const dir = path.join(sitePublicDir, "images", "products", category, slug);
  fs.mkdirSync(dir, { recursive: true });

  const basePath = path.join(dir, role);
  const exts = AUDIO_EXTS.some((e) => e === parsed.ext) ? AUDIO_EXTS : IMAGE_EXTS;
  deleteExisting(fs, basePath, exts);

  fs.writeFileSync(basePath + parsed.ext, parsed.buffer);
  return `/images/products/${category}/${slug}/${role}${parsed.ext}`;
}

// ── PUT ──────────────────────────────────────────────────────────────────────

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (isStatic) return NextResponse.json(null, { status: 501 });

  const fs = await import("fs");
  const path = await import("path");
  const matter = (await import("gray-matter")).default;
  const { getAllContentDirs } = await import("@/lib/content-paths");

  const { slug: rawSlug } = await params;
  const pageId = decodeURIComponent(rawSlug);
  const page = await request.json();

  const parts = pageId.split("/");
  if (parts.length < 2) return NextResponse.json({ error: "bad id" }, { status: 400 });
  const [sectionId, ...rest] = parts;
  const slug = rest.join("/");

  let filePath: string | null = null;
  for (const { sectionId: sid, dir } of getAllContentDirs()) {
    if (sid !== sectionId) continue;
    const fp = path.join(dir, `${slug}.md`);
    if (fs.existsSync(fp)) { filePath = fp; break; }
  }
  if (!filePath) return NextResponse.json({ error: "not found" }, { status: 404 });

  // Site public dir for saving assets
  const sitePublicDir = path.resolve(process.cwd(), "..", "site", "public");

  type Block = { type: string; enabled: boolean; data: Record<string, unknown> };
  const blocks: Block[] = page.blocks ?? [];
  const block = (t: string) => blocks.find((b) => b.type === t);
  const hasContent = (d: Record<string, unknown>) => d && !!(d.title as string)?.trim();
  const enabled = (b: Block | undefined) => b?.enabled ? b.data : null;
  const enabledIf = (b: Block | undefined) => b?.enabled && hasContent(b.data) ? b.data : null;

  const category = page.sectionId as string;
  const pageSlug = page.slug as string;

  // ── Extract and save binary assets ──────────────────────────────────────────

  const heroBlock = block("hero");
  if (heroBlock?.enabled && heroBlock.data) {
    const { heroImageData, audioData, audioFilename, ...cleanHero } = heroBlock.data as Record<string, unknown>;

    if (typeof heroImageData === "string" && heroImageData.startsWith("data:")) {
      saveAsset(fs, path, sitePublicDir, category, pageSlug, "cover", heroImageData);
    }

    if (typeof audioData === "string" && audioData.startsWith("data:")) {
      saveAsset(fs, path, sitePublicDir, category, pageSlug, "audio", audioData);
    }

    heroBlock.data = cleanHero;
  }

  const aboutBlock = block("about");
  if (aboutBlock?.enabled && aboutBlock.data) {
    const { aboutImageData, ...cleanAbout } = aboutBlock.data as Record<string, unknown>;

    if (typeof aboutImageData === "string" && aboutImageData.startsWith("data:")) {
      saveAsset(fs, path, sitePublicDir, category, pageSlug, "about", aboutImageData);
    }

    aboutBlock.data = cleanAbout;
  }

  // ── Build frontmatter ───────────────────────────────────────────────────────

  const expertsBlock = block("experts");
  const expertsValue = expertsBlock?.enabled && Array.isArray(expertsBlock.data?.experts) && (expertsBlock.data.experts as string[]).length > 0
    ? expertsBlock.data.experts
    : null;

  const fm: Record<string, unknown> = {
    slug: pageSlug, category,
    menuTitle: page.menuTitle, menuDescription: page.menuDescription,
    cardTitle: page.cardTitle, cardDescription: page.cardDescription,
    metaTitle: page.metaTitle, metaDescription: page.metaDescription,
    hero: enabled(heroBlock),
    about: enabledIf(aboutBlock),
    audience: enabledIf(block("audience")),
    tools: enabledIf(block("tools")),
    results: enabledIf(block("results")),
    process: enabledIf(block("process")),
    experts: expertsValue,
    aboutRocketmind: enabled(block("aboutRocketmind")),
    socialProof: null, duration: null, whyRocketmind: null, expert: null, cases: null, reviews: null,
  };

  const newPath = path.join(path.dirname(filePath), `${pageSlug}.md`);
  if (newPath !== filePath) fs.unlinkSync(filePath);
  fs.writeFileSync(newPath, matter.stringify("", fm), "utf-8");
  return NextResponse.json({ ok: true });
}

// ── DELETE ───────────────────────────────────────────────────────────────────

export async function DELETE(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (isStatic) return NextResponse.json(null, { status: 501 });

  const fs = await import("fs");
  const path = await import("path");
  const { getAllContentDirs } = await import("@/lib/content-paths");

  const { slug: rawSlug } = await params;
  const pageId = decodeURIComponent(rawSlug);
  const parts = pageId.split("/");
  if (parts.length < 2) return NextResponse.json({ error: "bad id" }, { status: 400 });
  const [sectionId, ...rest] = parts;
  const slug = rest.join("/");

  const siteRoot = path.resolve(process.cwd(), "..", "site");
  const archiveDir = path.join(siteRoot, "content", ".archive");

  for (const { sectionId: sid, dir } of getAllContentDirs()) {
    if (sid !== sectionId) continue;
    const fp = path.join(dir, `${slug}.md`);
    if (fs.existsSync(fp)) {
      // Archive markdown
      const dest = path.join(archiveDir, sectionId, slug);
      fs.mkdirSync(dest, { recursive: true });
      fs.renameSync(fp, path.join(dest, `${slug}.md`));

      // Archive assets
      const sitePublicDir = path.join(siteRoot, "public");
      const assetDir = path.join(sitePublicDir, "images", "products", sectionId, slug);
      if (fs.existsSync(assetDir)) {
        const assetDest = path.join(dest, "assets");
        fs.mkdirSync(assetDest, { recursive: true });
        for (const f of fs.readdirSync(assetDir)) {
          fs.renameSync(path.join(assetDir, f), path.join(assetDest, f));
        }
        fs.rmSync(assetDir, { recursive: true, force: true });
      }

      return NextResponse.json({ ok: true });
    }
  }
  return NextResponse.json({ error: "not found" }, { status: 404 });
}

export function generateStaticParams() {
  return [];
}
