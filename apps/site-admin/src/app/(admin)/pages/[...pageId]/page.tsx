import fs from "fs";
import path from "path";
import { PageEditorClient } from "./client";

/**
 * Generate static routes for every page in the snapshot. The snapshot is
 * written by scripts/build-cms-data.mjs *before* next build, so this file
 * exists when generateStaticParams runs.
 *
 * pageId is a catch-all param: `consulting/business-readiness` becomes
 * `/pages/consulting/business-readiness` — no URL encoding required.
 */
export function generateStaticParams() {
  const file = path.join(process.cwd(), "public", "data", "pages.json");
  let ids: string[] = [];
  try {
    const pages = JSON.parse(fs.readFileSync(file, "utf-8")) as Array<{ id: string }>;
    ids = pages.map((p) => p.id).filter(Boolean);
  } catch {
    ids = [];
  }
  if (ids.length === 0) ids = ["unique/about"];
  return ids.map((id) => ({ pageId: id.split("/") }));
}

export default function PageEditorPage({
  params,
}: {
  params: Promise<{ pageId: string[] }>;
}) {
  return <PageEditorClient params={params} />;
}
