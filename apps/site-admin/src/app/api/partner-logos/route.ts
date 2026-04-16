import { NextResponse } from "next/server";

const isStatic = process.env.NEXT_PUBLIC_STATIC === "1";

const SUPPORTED = new Set([".svg", ".png", ".jpg", ".jpeg", ".webp", ".avif"]);

const PREFERRED = ["beeline", "rusal", "mintsifry", "vtb", "tbank", "rosatom"];

/** Returns list of partner logos in `apps/site/public/clip-logos/` as path references */
export async function GET() {
  if (isStatic) return NextResponse.json([]);

  const fs = await import("fs");
  const path = await import("path");

  const dir = path.resolve(process.cwd(), "..", "site", "public", "clip-logos");
  if (!fs.existsSync(dir)) return NextResponse.json([]);

  const filenames = fs
    .readdirSync(dir)
    .filter((f) => SUPPORTED.has(path.extname(f).toLowerCase()))
    .sort((a, b) => {
      const aStem = a.replace(/\.[^.]+$/, "");
      const bStem = b.replace(/\.[^.]+$/, "");
      const ai = PREFERRED.indexOf(aStem);
      const bi = PREFERRED.indexOf(bStem);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });

  const logos = filenames.map((filename) => ({
    alt: filename.replace(/\.[^.]+$/, ""),
    src: `/clip-logos/${filename}`,
  }));

  return NextResponse.json(logos);
}
