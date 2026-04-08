import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getAllContentDirs } from "@/lib/content-paths";
import type { SitePage } from "@/lib/types";

// ── Find file by composite id (sectionId/slug) ─────────────────────────────

function findFile(pageId: string): { filePath: string; sectionId: string } | null {
  // pageId format: "consulting/ecosystem-strategy"
  const parts = pageId.split("/");
  if (parts.length < 2) return null;

  const sectionId = parts[0];
  const slug = parts.slice(1).join("/");

  for (const { sectionId: sid, dir } of getAllContentDirs()) {
    if (sid !== sectionId) continue;
    const filePath = path.join(dir, `${slug}.md`);
    if (fs.existsSync(filePath)) {
      return { filePath, sectionId: sid };
    }
  }
  return null;
}

// ── PUT /api/pages/[slug] — save page back to MD ───────────────────────────

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug: rawSlug } = await params;
  const pageId = decodeURIComponent(rawSlug);
  const page = (await request.json()) as SitePage;

  const found = findFile(pageId);
  if (!found) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  // Build frontmatter from page data
  const heroBlock = page.blocks.find((b) => b.type === "hero");
  const aboutBlock = page.blocks.find((b) => b.type === "about");
  const audienceBlock = page.blocks.find((b) => b.type === "audience");
  const resultsBlock = page.blocks.find((b) => b.type === "results");
  const processBlock = page.blocks.find((b) => b.type === "process");

  const frontmatter: Record<string, unknown> = {
    slug: page.slug,
    category: page.sectionId,
    menuTitle: page.menuTitle,
    menuDescription: page.menuDescription,
    cardTitle: page.cardTitle,
    cardDescription: page.cardDescription,
    metaTitle: page.metaTitle,
    metaDescription: page.metaDescription,
    hero: heroBlock?.enabled ? heroBlock.data : null,
    about: aboutBlock?.enabled && hasContent(aboutBlock.data) ? aboutBlock.data : null,
    audience: audienceBlock?.enabled && hasContent(audienceBlock.data) ? audienceBlock.data : null,
    results: resultsBlock?.enabled && hasContent(resultsBlock.data) ? resultsBlock.data : null,
    process: processBlock?.enabled && hasContent(processBlock.data) ? processBlock.data : null,
    socialProof: null,
    tools: null,
    duration: null,
    whyRocketmind: null,
    expert: null,
    cases: null,
    reviews: null,
  };

  const content = matter.stringify("", frontmatter);

  // If slug changed, rename file
  const newFilePath = path.join(
    path.dirname(found.filePath),
    `${page.slug}.md`
  );
  if (newFilePath !== found.filePath) {
    fs.unlinkSync(found.filePath);
  }

  fs.writeFileSync(newFilePath, content, "utf-8");

  return NextResponse.json({ ok: true });
}

// ── DELETE /api/pages/[slug] ────────────────────────────────────────────────

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug: rawSlug } = await params;
  const pageId = decodeURIComponent(rawSlug);

  const found = findFile(pageId);
  if (!found) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  fs.unlinkSync(found.filePath);
  return NextResponse.json({ ok: true });
}

// ── Utility ─────────────────────────────────────────────────────────────────

function hasContent(data: Record<string, unknown>): boolean {
  if (!data) return false;
  const title = data.title as string | undefined;
  return !!title && title.trim().length > 0;
}
