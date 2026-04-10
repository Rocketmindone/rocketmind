// Shared types & defaults for AboutRocketmind section
// Separate file (no "use client") so Server Components can import safely

export type AboutRocketmindVariant = "dark" | "light";
export type AboutRocketmindLeftVariant = "alex" | "canvas";

export interface AboutRmFeature {
  title: string;
  text: string;
}

export type AboutRocketmindSectionProps = {
  heading: string;
  founderName: string;
  founderBio: string;
  founderRole: string;
  /** Canvas variant — title + description instead of founder info */
  canvasTitle: string;
  canvasText: string;
  features: AboutRmFeature[];
  variant?: AboutRocketmindVariant;
  /** Left part variant: "alex" = founder photo, "canvas" = methodology image */
  leftVariant?: AboutRocketmindLeftVariant;
};

export const ABOUT_RM_DEFAULTS: AboutRocketmindSectionProps = {
  heading: "От идеи\nдо бизнес-модели",
  founderName: "Алексей Еремин",
  founderBio: "Мы не просто консультируем, мы строим работающие сетевые структуры",
  founderRole: "Основатель Rocketmind, эксперт по экосистемной архитектуре и стратег цифровой трансформации.",
  canvasTitle: "Цифровые платформы\nи экосистемы",
  canvasText: "Развиваем и используем международную методологию Platform Innovation Kit, представляем её в России и странах Азии, помогая компаниям проектировать платформенные модели, находить новые точки роста и выстраивать более сильную архитектуру бизнеса.",
  features: [
    {
      title: "Доступ к ИИ-агентам",
      text: "Встроенные интеллектуальные ассистенты, которые усиливают командную работу. Работают внутри каждого продукта Rocketmind.",
    },
    {
      title: "Более 20 лет в IT",
      text: "Мы создавали онлайн-продукты, сервисы и платформы, выступали с лекциями для научного и бизнес-сообщества в России и за рубежом.",
    },
    {
      title: "Экспертная команда",
      text: "Над исследованиями работают аналитики и маркетологи, команда редакторов делает материалы простыми для восприятия.",
    },
  ],
  variant: "dark",
  leftVariant: "alex",
};
