import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getAllContentDirs, getContentDir } from "@/lib/content-paths";
import type { SitePage, PageBlock, BlockType } from "@/lib/types";
import { DEFAULT_BLOCK_TYPES } from "@/lib/constants";

// ── Helpers ─────────────────────────────────────────────────────────────────

function mdToPage(filePath: string, sectionId: string): SitePage | null {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);
    if (!data.slug) return null;

    const blocks: PageBlock[] = DEFAULT_BLOCK_TYPES.map(
      (type: BlockType, index: number) => {
        let blockData: Record<string, unknown> = {};
        let enabled = true;

        switch (type) {
          case "hero":
            blockData = data.hero || {};
            enabled = !!data.hero;
            break;
          case "about":
            if (data.about) blockData = data.about;
            else enabled = false;
            break;
          case "audience":
            if (data.audience) blockData = data.audience;
            else enabled = false;
            break;
          case "results":
            if (data.results) blockData = data.results;
            else enabled = false;
            break;
          case "process":
            if (data.process) blockData = data.process;
            else enabled = false;
            break;
          case "logoMarquee":
          case "pageBottom":
            // These have no editable data
            break;
        }

        return {
          id: `${data.slug}_${type}`,
          type,
          enabled,
          order: index,
          data: blockData,
        };
      }
    );

    const stat = fs.statSync(filePath);

    return {
      id: `${sectionId}/${data.slug}`,
      sectionId,
      slug: data.slug,
      status: "published",
      order: 0,
      menuTitle: data.menuTitle || "",
      menuDescription: data.menuDescription || "",
      cardTitle: data.cardTitle || "",
      cardDescription: data.cardDescription || "",
      metaTitle: data.metaTitle || "",
      metaDescription: data.metaDescription || "",
      blocks,
      createdAt: stat.birthtime.toISOString(),
      updatedAt: stat.mtime.toISOString(),
    };
  } catch {
    return null;
  }
}

function readAllPages(): SitePage[] {
  const pages: SitePage[] = [];

  for (const { sectionId, dir } of getAllContentDirs()) {
    if (!fs.existsSync(dir)) continue;

    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".md") && !f.startsWith("_"));

    files.forEach((file, index) => {
      const page = mdToPage(path.join(dir, file), sectionId);
      if (page) {
        page.order = index;
        pages.push(page);
      }
    });
  }

  return pages;
}

// ── GET /api/pages ──────────────────────────────────────────────────────────

export async function GET() {
  const pages = readAllPages();
  return NextResponse.json(pages);
}

// ── POST /api/pages — create new page ───────────────────────────────────────

export async function POST(request: Request) {
  const body = await request.json();
  const { sectionId, slug, menuTitle } = body as {
    sectionId: string;
    slug: string;
    menuTitle: string;
  };

  const dir = getContentDir(sectionId);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filePath = path.join(dir, `${slug}.md`);
  if (fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File already exists" }, { status: 409 });
  }

  const captionMap: Record<string, string> = {
    consulting: "консалтинг и стратегии",
    academy: "онлайн-школа",
    "ai-products": "ии-продукты",
    cases: "кейсы",
    media: "медиа",
  };

  const frontmatter: Record<string, unknown> = {
    slug,
    category: sectionId,
    menuTitle,
    menuDescription: "",
    cardTitle: menuTitle,
    cardDescription: "",
    metaTitle: `${menuTitle} | Rocketmind`,
    metaDescription: "",
    hero: {
      caption: captionMap[sectionId] || sectionId,
      title: menuTitle.toUpperCase(),
      description: "",
      ctaText: "оставить заявку",
      factoids: [],
    },
    about: null,
    audience: null,
    results: null,
    process: null,
    socialProof: null,
    tools: null,
    duration: null,
    whyRocketmind: null,
    expert: null,
    cases: null,
    reviews: null,
  };

  const content = matter.stringify("", frontmatter);
  fs.writeFileSync(filePath, content, "utf-8");

  const page = mdToPage(filePath, sectionId);
  return NextResponse.json(page, { status: 201 });
}
