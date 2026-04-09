import { NextResponse } from "next/server";
import path from "path";

const isStatic = process.env.NEXT_PUBLIC_STATIC === "1";
const SITE_ROOT = path.resolve(process.cwd(), "..", "site");
const EXPERTS_DIR = path.join(SITE_ROOT, "content", "experts");
const IMAGES_DIR = path.join(SITE_ROOT, "public", "images", "experts");

/** PUT /api/experts/[slug] — update expert data */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (isStatic) return NextResponse.json(null, { status: 501 });

  const { slug } = await params;
  const fs = await import("fs");
  const matter = (await import("gray-matter")).default;

  const filePath = path.join(EXPERTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath))
    return NextResponse.json({ error: "not found" }, { status: 404 });

  const body = await request.json();
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(raw);

  const updated = { ...data, ...body, slug };
  fs.writeFileSync(filePath, matter.stringify("", updated), "utf-8");

  return NextResponse.json({ slug, ...updated });
}

/** POST /api/experts/[slug]/photo — upload expert photo */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (isStatic) return NextResponse.json(null, { status: 501 });

  const { slug } = await params;
  const fs = await import("fs");

  const formData = await request.formData();
  const file = formData.get("photo") as File | null;
  if (!file) return NextResponse.json({ error: "no file" }, { status: 400 });

  const ext = file.name.split(".").pop() || "jpg";
  const buffer = Buffer.from(await file.arrayBuffer());

  if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

  // Remove old photos with any extension
  for (const oldExt of ["jpg", "png", "webp", "svg"]) {
    const oldPath = path.join(IMAGES_DIR, `${slug}.${oldExt}`);
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }

  const imagePath = path.join(IMAGES_DIR, `${slug}.${ext}`);
  fs.writeFileSync(imagePath, buffer);

  return NextResponse.json({
    image: `/images/experts/${slug}.${ext}`,
  });
}
