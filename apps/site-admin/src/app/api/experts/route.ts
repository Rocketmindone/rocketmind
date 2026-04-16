import { NextResponse } from "next/server";
import path from "path";

const isStatic = process.env.NEXT_PUBLIC_STATIC === "1";
const SITE_ROOT = path.resolve(process.cwd(), "..", "site");
const EXPERTS_DIR = path.join(SITE_ROOT, "content", "experts");
const PUBLIC_DIR = path.join(SITE_ROOT, "public");

function resolveImage(slug: string): string | null {
  const fs = require("fs") as typeof import("fs");
  const base = `/images/experts/${slug}`;
  for (const ext of [".jpg", ".png", ".webp", ".svg"]) {
    if (fs.existsSync(path.join(PUBLIC_DIR, base + ext))) return base + ext;
  }
  return null;
}

/** GET /api/experts — list all experts */
export async function GET() {
  if (isStatic) return NextResponse.json([]);

  const fs = await import("fs");
  const matter = (await import("gray-matter")).default;

  if (!fs.existsSync(EXPERTS_DIR)) return NextResponse.json([]);

  const experts = fs
    .readdirSync(EXPERTS_DIR)
    .filter((f: string) => f.endsWith(".md") && !f.startsWith("_"))
    .map((file: string) => {
      try {
        const raw = fs.readFileSync(path.join(EXPERTS_DIR, file), "utf-8");
        const { data } = matter(raw);
        const slug = data.slug || file.replace(/\.md$/, "");
        return {
          slug,
          name: data.name || "",
          tag: data.tag || "Эксперт продукта",
          shortBio: data.shortBio || "",
          bio: data.bio || "",
          image: resolveImage(slug),
        };
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  return NextResponse.json(experts);
}

/** POST /api/experts — create new expert */
export async function POST(request: Request) {
  if (isStatic) return NextResponse.json(null, { status: 501 });

  const fs = await import("fs");
  const matter = (await import("gray-matter")).default;

  const body = await request.json();
  const { slug, name, tag, shortBio, bio } = body;

  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  if (!fs.existsSync(EXPERTS_DIR)) fs.mkdirSync(EXPERTS_DIR, { recursive: true });

  const filePath = path.join(EXPERTS_DIR, `${slug}.md`);
  if (fs.existsSync(filePath)) return NextResponse.json({ error: "exists" }, { status: 409 });

  const fm: Record<string, unknown> = {
    slug,
    name: name || "",
    tag: tag || "Эксперт продукта",
    shortBio: shortBio || "",
    bio: bio || "",
  };
  fs.writeFileSync(filePath, matter.stringify("", fm), "utf-8");

  return NextResponse.json(
    { slug, name: fm.name, tag: fm.tag, shortBio: fm.shortBio, bio: fm.bio, image: null },
    { status: 201 },
  );
}
