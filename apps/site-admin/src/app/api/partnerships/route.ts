import { NextResponse } from "next/server";

const isStatic = process.env.NEXT_PUBLIC_STATIC === "1";

const MIME_TO_EXT: Record<string, string> = {
  "image/png": ".png", "image/jpeg": ".jpg", "image/jpg": ".jpg",
  "image/webp": ".webp", "image/svg+xml": ".svg", "image/gif": ".gif",
};

const IMAGE_EXTS = [".svg", ".png", ".jpg", ".jpeg", ".webp", ".gif"];

function parseDataUrl(dataUrl: string): { mime: string; ext: string; buffer: Buffer } | null {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  const mime = match[1];
  const ext = MIME_TO_EXT[mime] || null;
  if (!ext) return null;
  return { mime, ext, buffer: Buffer.from(match[2], "base64") };
}

// ── GET — read shared partnerships data ─────────────────────────────────────

export async function GET() {
  if (isStatic) return NextResponse.json(null);

  const fs = await import("fs");
  const path = await import("path");

  const siteRoot = path.resolve(process.cwd(), "..", "site");
  const jsonPath = path.join(siteRoot, "content", "_partnerships.json");

  if (!fs.existsSync(jsonPath)) {
    return NextResponse.json({
      caption: "Партнёрства",
      title: "",
      description: "",
      logos: [],
      photos: [],
    });
  }

  const raw = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  // Convert file-based logos/photos to base64 data URLs for admin display
  const sitePublicDir = path.join(siteRoot, "public");

  function resolveImage(src: string): string {
    if (!src || src.startsWith("data:")) return src;
    const filePath = path.join(sitePublicDir, src);
    if (!fs.existsSync(filePath)) return src;
    const ext = path.extname(filePath).toLowerCase();
    const mimeMap: Record<string, string> = {
      ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif",
    };
    const mime = mimeMap[ext] || "application/octet-stream";
    const buf = fs.readFileSync(filePath);
    return `data:${mime};base64,${buf.toString("base64")}`;
  }

  return NextResponse.json({
    caption: raw.caption || "",
    title: raw.title || "",
    description: raw.description || "",
    logos: (raw.logos || []).map((l: { src: string; alt: string }) => ({
      src: resolveImage(l.src),
      alt: l.alt || "",
    })),
    photos: (raw.photos || []).map((p: { src: string; alt?: string }) => ({
      src: resolveImage(p.src),
      alt: p.alt || "",
    })),
  });
}

// ── PUT — save shared partnerships data ─────────────────────────────────────

export async function PUT(request: Request) {
  if (isStatic) return NextResponse.json(null, { status: 501 });

  const fs = await import("fs");
  const path = await import("path");

  const siteRoot = path.resolve(process.cwd(), "..", "site");
  const sitePublicDir = path.join(siteRoot, "public");
  const partnershipsDir = path.join(sitePublicDir, "images", "partnerships");
  fs.mkdirSync(partnershipsDir, { recursive: true });

  const body = await request.json();

  // Process logos — save base64 data URLs to files
  const logos: Array<{ src: string; alt: string }> = [];
  for (let i = 0; i < (body.logos || []).length; i++) {
    const logo = body.logos[i];
    if (logo.src && logo.src.startsWith("data:")) {
      const parsed = parseDataUrl(logo.src);
      if (parsed) {
        const filename = `logo-${i}${parsed.ext}`;
        // Delete old logo files with same base name
        for (const ext of IMAGE_EXTS) {
          const old = path.join(partnershipsDir, `logo-${i}${ext}`);
          if (fs.existsSync(old)) fs.unlinkSync(old);
        }
        fs.writeFileSync(path.join(partnershipsDir, filename), parsed.buffer);
        logos.push({ src: `/images/partnerships/${filename}`, alt: logo.alt || "" });
      }
    } else {
      logos.push({ src: logo.src, alt: logo.alt || "" });
    }
  }

  // Process photos — save base64 data URLs to files
  const photos: Array<{ src: string; alt: string }> = [];
  for (let i = 0; i < (body.photos || []).length; i++) {
    const photo = body.photos[i];
    if (photo.src && photo.src.startsWith("data:")) {
      const parsed = parseDataUrl(photo.src);
      if (parsed) {
        const filename = `photo-${i + 1}${parsed.ext}`;
        for (const ext of IMAGE_EXTS) {
          const old = path.join(partnershipsDir, `photo-${i + 1}${ext}`);
          if (fs.existsSync(old)) fs.unlinkSync(old);
        }
        fs.writeFileSync(path.join(partnershipsDir, filename), parsed.buffer);
        photos.push({ src: `/images/partnerships/${filename}`, alt: photo.alt || "" });
      }
    } else {
      photos.push({ src: photo.src, alt: photo.alt || "" });
    }
  }

  const data = {
    caption: body.caption || "",
    title: body.title || "",
    description: body.description || "",
    logos,
    photos,
  };

  const jsonPath = path.join(siteRoot, "content", "_partnerships.json");
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), "utf-8");

  return NextResponse.json({ ok: true });
}
