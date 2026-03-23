import { readFile } from "node:fs/promises";
import path from "node:path";

import { getHeroLogoFilePath } from "@/lib/partner-logos";

const CONTENT_TYPES: Record<string, string> = {
  ".avif": "image/avif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ filename: string }> }
) {
  const { filename } = await context.params;
  const filePath = await getHeroLogoFilePath(filename);

  if (!filePath) {
    return new Response("Not found", { status: 404 });
  }

  const file = await readFile(filePath);
  const extension = path.extname(filePath).toLowerCase();

  return new Response(file, {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": CONTENT_TYPES[extension] ?? "application/octet-stream",
    },
  });
}
