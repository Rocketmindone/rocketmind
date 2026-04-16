import { ServicesGridClient, type ServiceSection } from "./ServicesGridClient";
import {
  CONSULTING_SERVICES,
  ACADEMY_COURSES,
  AI_PRODUCTS,
} from "@/content/site-nav";
import { getAllCatalogProducts } from "@/lib/products";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function ServicesGrid() {
  // Enrich cards with cover images and expert data from product system
  const allProducts = getAllCatalogProducts();
  const productMap = new Map(
    allProducts.map((p) => [`${p.category}/${p.slug}`, p]),
  );

  const sectionsData: ServiceSection[] = [
    {
      trackName: "Консалтинг и стратегии",
      headerHighlight: "Стратегия и бизнес-модели",
      mobileTitle: "Стратегия\nи бизнес-модели",
      description:
        "Помогаем командам искать, проверять и усиливать бизнес-модели, связывать стратегию с операционными действиями и переходить от продуктовой логики к платформенной и экосистемной архитектуре.",
      catalogHref: "/products?filter=consulting",
      catalogLabel: "Все продукты",
      showIcons: true,
      cards: CONSULTING_SERVICES.map((s) => {
        const slug = s.href.split("/").pop()!;
        const product = productMap.get(`consulting/${slug}`);
        return {
          title: s.title,
          description: s.description,
          href: s.href,
          coverImage: product?.heroImage ?? undefined,
          experts:
            product?.experts
              ?.filter((e) => e.image)
              .map((e) => ({ name: e.name, image: e.image! })) ?? [],
          expertProduct: product?.expertProduct ?? false,
        };
      }),
    },
    {
      trackName: "Онлайн-школа",
      headerHighlight: "академия бизнес-дизайна",
      mobileTitle: "Академия\nбизнес-дизайна",
      description:
        "Среда, где управленцы и команды осваивают бизнес-дизайн, платформенное мышление и работу с гипотезами. Мы обучаем тому, что сами применяем в проектах: от системной стратегии до запуска цифровых инициатив.",
      catalogHref: "/products?filter=academy",
      catalogLabel: "Все курсы",
      showImages: true,
      partnerBlock: {
        title: "Программы с ведущими бизнес-школами",
        description:
          "Обучаем топ-менеджеров крупных компаний, помогаем трансформировать бизнес с помощью бизнес-дизайна",
        logos: [
          { src: `${BASE_PATH}/partners/partner-logo-1.1.svg`, width: 230, height: 46 },
          { src: `${BASE_PATH}/partners/partner-logo-2.2.png`, width: 182, height: 60 },
        ],
      },
      cards: [
        ...ACADEMY_COURSES.map((s) => {
          const slug = s.href.split("/").pop()!;
          const product = productMap.get(`academy/${slug}`);
          return {
            title: s.title,
            description: s.description,
            href: s.href,
            coverImage: product?.heroImage ?? undefined,
            factoids: product?.hero?.factoids?.slice(0, 3).map((f) => ({ number: f.number, text: f.text })),
          };
        }),
      ],
    },
    {
      trackName: "AI-продукты",
      headerHighlight: "продукты с AI для бизнеса",
      mobileTitle: "Продукты\nс AI для бизнеса",
      description:
        "Встроенные помощники, которые усиливают мышление, а не заменяют экспертов. Они помогают командам быстрее проходить через сложные задачи: от исследования и анализа до формирования бизнес-моделей и стратегий.",
      catalogHref: "/products?filter=ai-products",
      catalogLabel: "Все продукты",
      showImages: true,
      cards: AI_PRODUCTS.map((s) => {
        const slug = s.href.split("/").pop()!;
        const product = productMap.get(`ai-products/${slug}`);
        return {
          title: s.title,
          description: s.description,
          href: s.href,
          coverImage: product?.heroImage ?? undefined,
          factoids: product?.hero?.factoids?.slice(0, 3).map((f) => ({ number: f.number, text: f.text })),
        };
      }),
    },
  ];

  return <ServicesGridClient sections={sectionsData} />;
}
