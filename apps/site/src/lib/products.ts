import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { resolveExperts, type ExpertData } from "./experts";

// ── Types ──────────────────────────────────────────────────────────────────────

export type Factoid = {
  number: string;
  label: string;
  text: string;
};

export type HeroTag = {
  text: string;
  icon?: string;
};

export type ProductHeroData = {
  caption: string;
  title: string;
  description: string;
  ctaText: string;
  factoids: Factoid[];
  /** Optional tags shown next to caption (e.g. "при поддержке PIK") */
  tags?: HeroTag[];
  /** Optional secondary ghost-style button text */
  secondaryCta?: string;
  /** Audio data URL (base64) from CMS */
  audioData?: string;
};

export type AccordionItem = {
  title: string;
  description: string;
};

export type AboutProductData = {
  caption: string;
  title: string;
  description: string;
  accordion: AccordionItem[];
  /** Whether an image is shown (resolved from filesystem) */
  hasImage: boolean;
};

export type ForWhomFact = {
  title: string;
  text: string;
};

export type ForWhomData = {
  tag: string;
  title: string;
  subtitle?: string;
  facts: ForWhomFact[];
  wideColumn?: "left" | "right";
};

export type ProcessStep = {
  number: string;
  title: string;
  text: string;
  duration: string;
};

export type ProcessParticipant = {
  role: string;
  text: string;
};

export type ProcessData = {
  tag: string;
  title: string;
  subtitle: string;
  description?: string;
  steps: ProcessStep[];
  participantsTag?: string;
  participants?: ProcessParticipant[];
  variant?: "product" | "academy";
};

export type ResultCardData = {
  title: string;
  text: string;
};

export type ResultsData = {
  tag: string;
  title: string;
  description?: string;
  cards: ResultCardData[];
};

export type { ExpertData };

export type ToolCardData = {
  number: string;
  title: string;
  text: string;
  icon?: string | null;
};

export type ToolsData = {
  tag: string;
  title: string;
  description?: string;
  useIcons?: boolean;
  tools: ToolCardData[];
};

export type AboutRocketmindData = {
  heading: string;
  founderName: string;
  founderBio: string;
  founderRole: string;
  canvasTitle?: string;
  canvasText?: string;
  features: Array<{ title: string; text: string }>;
  variant?: "dark" | "light";
  leftVariant?: "alex" | "canvas";
};

export type ProductData = {
  slug: string;
  category: string;
  // Menu / Navigation
  menuTitle: string;
  menuDescription: string;
  // Product Card
  cardTitle: string;
  cardDescription: string;
  // SEO
  metaTitle: string;
  metaDescription: string;
  // Hero
  hero: ProductHeroData;
  // About product
  about: AboutProductData | null;
  // For whom
  audience: ForWhomData | null;
  // Tools
  tools: ToolsData | null;
  // Results
  results: ResultsData | null;
  // Process
  process: ProcessData | null;
  // Experts
  experts: ExpertData[] | null;
  // About Rocketmind (CMS-editable)
  aboutRocketmind: AboutRocketmindData | null;
  // Image paths (auto-resolved)
  coverImage: string;
  /** Resolved cover image path (null if file doesn't exist) */
  heroImage: string | null;
  aboutImage: string | null;
};

// ── Paths ──────────────────────────────────────────────────────────────────────

const PRODUCTS_DIR = path.join(process.cwd(), "content", "products");
const CONTENT_DIRS: Record<string, string> = {
  consulting: path.join(process.cwd(), "content", "products"),
  academy: path.join(process.cwd(), "content", "academy"),
  "ai-products": path.join(process.cwd(), "content", "ai-products"),
  cases: path.join(process.cwd(), "content", "cases"),
  media: path.join(process.cwd(), "content", "media"),
};
const PUBLIC_DIR = path.join(process.cwd(), "public");
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

/**
 * Auto-resolve product asset by role.
 *
 * Convention:
 *   /images/products/<category>/<slug>/cover.svg
 *   /images/products/<category>/<slug>/about.jpg
 *   /images/products/<category>/<slug>/audio.mp3
 */
function resolveAsset(
  category: string,
  slug: string,
  role: string,
  extensions: string[],
): string | null {
  const base = `/images/products/${category}/${slug}/${role}`;
  for (const ext of extensions) {
    if (fs.existsSync(path.join(PUBLIC_DIR, base + ext))) {
      return BASE_PATH + base + ext;
    }
  }
  return null;
}

function resolveImage(category: string, slug: string, role: string): string | null {
  return resolveAsset(category, slug, role, [".svg", ".png", ".jpg", ".webp"]);
}

function resolveAudio(category: string, slug: string): string | null {
  return resolveAsset(category, slug, "audio", [".mp3", ".wav", ".ogg", ".m4a", ".webm"]);
}

// ── API ────────────────────────────────────────────────────────────────────────

export function getProductBySlug(slug: string, category?: string): ProductData | null {
  // Try category-specific dir first, fall back to products dir
  let filePath = path.join(PRODUCTS_DIR, `${slug}.md`);
  if (category && CONTENT_DIRS[category]) {
    const catPath = path.join(CONTENT_DIRS[category], `${slug}.md`);
    if (fs.existsSync(catPath)) filePath = catPath;
  }
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(raw);

  const staticCover = resolveImage(data.category, data.slug, "cover");
  const staticAbout = resolveImage(data.category, data.slug, "about");

  const staticAudio = resolveAudio(data.category, data.slug);

  const coverImage =
    staticCover ??
    `${BASE_PATH}/images/products/${data.category}/${data.slug}/cover.svg`;

  const heroImage = staticCover ?? null;
  const aboutImage = staticAbout ?? null;

  const about: AboutProductData | null = data.about
    ? {
        caption: data.about.caption,
        title: data.about.title,
        description: data.about.description,
        accordion: data.about.accordion ?? [],
        hasImage: aboutImage !== null,
      }
    : null;

  // Strip base64 blobs — assets are now resolved from filesystem
  const { heroImageData: _h, audioData: _a, audioFilename: _af, ...heroClean } = data.hero ?? {};

  return {
    slug: data.slug,
    category: data.category,
    menuTitle: data.menuTitle,
    menuDescription: data.menuDescription,
    cardTitle: data.cardTitle,
    cardDescription: data.cardDescription,
    metaTitle: data.metaTitle,
    metaDescription: data.metaDescription,
    hero: {
      ...heroClean,
      title: (data.hero.title as string).trimEnd(),
      audioData: staticAudio ?? undefined,
    },
    about,
    audience: data.audience ?? null,
    tools: data.tools ?? null,
    results: data.results ?? null,
    process: data.process ?? null,
    experts: Array.isArray(data.experts) && data.experts.length > 0
      ? resolveExperts(data.experts as string[])
      : null,
    aboutRocketmind: data.aboutRocketmind ?? null,
    coverImage,
    heroImage,
    aboutImage,
  };
}

export function getAllProducts(): ProductData[] {
  if (!fs.existsSync(PRODUCTS_DIR)) return [];

  return fs
    .readdirSync(PRODUCTS_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((f) => getProductBySlug(f.replace(/\.md$/, "")))
    .filter(Boolean) as ProductData[];
}

export function getProductsByCategory(category: string): ProductData[] {
  return getAllProducts().filter((p) => p.category === category);
}
