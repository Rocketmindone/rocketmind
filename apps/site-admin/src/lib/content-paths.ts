import path from "path";

/**
 * Maps section IDs to content directories relative to the monorepo root.
 * The admin app is at apps/site-admin, content is at apps/site/content/.
 */

const SITE_ROOT = path.resolve(process.cwd(), "..", "site");

export const SECTION_DIRS: Record<string, string> = {
  consulting: path.join(SITE_ROOT, "content", "products"),
  academy: path.join(SITE_ROOT, "content", "academy"),
  "ai-products": path.join(SITE_ROOT, "content", "ai-products"),
  cases: path.join(SITE_ROOT, "content", "cases"),
  media: path.join(SITE_ROOT, "content", "media"),
};

export function getContentDir(sectionId: string): string {
  return SECTION_DIRS[sectionId] || SECTION_DIRS.consulting;
}

export function getAllContentDirs(): Array<{ sectionId: string; dir: string }> {
  return Object.entries(SECTION_DIRS).map(([sectionId, dir]) => ({
    sectionId,
    dir,
  }));
}
