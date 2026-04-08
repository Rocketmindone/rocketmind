import {
  CONSULTING_SERVICES,
  ACADEMY_COURSES,
  AI_PRODUCTS,
} from "@rocketmind/ui/content";
import type { SitePage, AdminStore, PageBlock, BlockType } from "./types";
import { DEFAULT_BLOCK_TYPES } from "./constants";

let idCounter = 0;
function genId(): string {
  return `p_${Date.now()}_${++idCounter}`;
}

function genBlockId(): string {
  return `b_${Date.now()}_${++idCounter}`;
}

function createDefaultBlocks(): PageBlock[] {
  return DEFAULT_BLOCK_TYPES.map((type, index) => ({
    id: genBlockId(),
    type,
    enabled: true,
    order: index,
    data: getDefaultBlockData(type),
  }));
}

function getDefaultBlockData(type: BlockType): Record<string, unknown> {
  switch (type) {
    case "hero":
      return {
        caption: "",
        title: "",
        description: "",
        ctaText: "Оставить заявку",
        factoids: [],
      };
    case "about":
      return {
        caption: "О продукте",
        title: "",
        description: "",
        accordion: [],
      };
    case "audience":
      return {
        tag: "Для кого",
        title: "",
        subtitle: "",
        facts: [],
        wideColumn: "left",
      };
    case "results":
      return {
        tag: "Результаты",
        title: "",
        description: "",
        cards: [],
      };
    case "process":
      return {
        tag: "Процесс",
        title: "",
        subtitle: "",
        description: "",
        steps: [],
        participantsTag: "Участники",
        participants: [],
      };
    default:
      return {};
  }
}

interface NavItem {
  href: string;
  title: string;
  description: string;
}

function navItemsToPages(items: NavItem[], sectionId: string): SitePage[] {
  return items.map((item, index) => {
    const slug = item.href.split("/").pop() || "";
    const now = new Date().toISOString();
    return {
      id: genId(),
      sectionId,
      slug,
      status: "published" as const,
      order: index,
      menuTitle: item.title,
      menuDescription: item.description,
      cardTitle: item.title,
      cardDescription: item.description,
      metaTitle: `${item.title} — Rocketmind`,
      metaDescription: item.description,
      blocks: createDefaultBlocks(),
      createdAt: now,
      updatedAt: now,
    };
  });
}

export function createSeedStore(): AdminStore {
  const pages: SitePage[] = [
    ...navItemsToPages(CONSULTING_SERVICES, "consulting"),
    ...navItemsToPages(ACADEMY_COURSES, "academy"),
    ...navItemsToPages(AI_PRODUCTS, "ai-products"),
  ];

  return {
    version: 1,
    pages,
    lastSaved: new Date().toISOString(),
  };
}
