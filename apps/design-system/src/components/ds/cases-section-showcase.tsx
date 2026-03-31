"use client"

import { InfiniteLogoMarquee } from "@rocketmind/ui"
import type { LogoMarqueeItem } from "@rocketmind/ui"

const BASE_PATH = process.env.NODE_ENV === "production" ? "/rocketmind/ds" : ""

const LOGOS: LogoMarqueeItem[] = [
  { alt: "Билайн",      src: `${BASE_PATH}/clip-logos/bilaine.svg`,     width: 125, height: 24 },
  { alt: "ВТБ",         src: `${BASE_PATH}/clip-logos/vtb.svg`,         width: 90,  height: 33 },
  { alt: "Т-Банк",      src: `${BASE_PATH}/clip-logos/tbank.svg`,       width: 116, height: 37 },
  { alt: "Росатом",     src: `${BASE_PATH}/clip-logos/rosatom.svg`,     width: 109, height: 39 },
  { alt: "Минцифры",    src: `${BASE_PATH}/clip-logos/mincifr.svg`,     width: 146, height: 32 },
  { alt: "РУСАЛ",       src: `${BASE_PATH}/clip-logos/ruslan.svg`,      width: 113, height: 34 },
  { alt: "Газпромбанк", src: `${BASE_PATH}/clip-logos/gazprombank.svg`, width: 120, height: 36 },
  { alt: "МТС",         src: `${BASE_PATH}/clip-logos/mtc.svg`,         width: 75,  height: 34 },
  { alt: "ВКонтакте",   src: `${BASE_PATH}/clip-logos/vk.svg`,          width: 80,  height: 34 },
  { alt: "X5 Group",    src: `${BASE_PATH}/clip-logos/x5.svg`,          width: 90,  height: 36 },
]

const DEMO_TESTIMONIALS = [
  {
    avatar: `${BASE_PATH}/ai-mascots/mark/mark_confident.png`,
    name: "Игорь М.",
    position: "Руководитель направления коммерческого транспорта",
    text: "Стратегия — инструмент, который мы продолжаем использовать. Мы регулярно к нему возвращаемся, дорабатываем, адаптируем под изменения рынка. Это фундамент, который останется с нами надолго.",
    text2: "От своего лица и от лица компании хочу выразить глубокую благодарность и признательность команде Rocketmind за подготовку и проведение стратегической сессии.",
  },
  {
    avatar: `${BASE_PATH}/ai-mascots/kate/kate_base.png`,
    name: "Виктория Н.",
    position: "Директор направления",
    text: "Мы стремимся к осмысленному управлению продуктовой разработкой, созданию ценности для клиентов.",
  },
  {
    avatar: `${BASE_PATH}/ai-mascots/alex/alex_confident.png`,
    name: "Алексей К.",
    position: "Генеральный директор",
    text: "Сделали огромный шаг в понимании нашего текущего статуса и следующих шагов в нашей работе. Спасибо.",
  },
]

const DEMO_CASE = {
  label: "Кейсы",
  title: "ДИАГНОСТИКА И ОПТИМИЗАЦИЯ ЛИНЕЙКИ HR-ПРОДУКТОВ ДЛЯ КРУПНОЙ ТОПЛИВНОЙ КОМПАНИИ",
  description: "Провели глубокий анализ и стратегические сессии с 40+ сотрудниками, выявили узкие места, разработали интегрированные решения для повышения эффективности HR-продуктов и заложили основу для роста подразделений.",
  stats: [
    { value: "40+", label: "УЧАСТНИКОВ\nСЕССИЙ",    description: "Провели интервью и групповые сессии с представителями четырёх ключевых HR-подразделений компании" },
    { value: "30+", label: "ВНУТРЕННИХ\nПРОДУКТОВ", description: "Проанализировали портфель HR-инструментов, выявили дублирование функций и незакрытые потребности сотрудников" },
    { value: "2",   label: "ЭТАПА\nПРОЕКТА",        description: "Провели диагностику и разработку решений последовательно — каждый этап строился на результатах предыдущего" },
  ],
  result: "КОМПАНИЯ ПОЛУЧИЛА ЕДИНУЮ СИСТЕМУ УПРАВЛЕНИЯ HR-ПРОДУКТАМИ С ЧЁТКИМ ПЛАНОМ ИНТЕГРАЦИИ И МЕТРИКАМИ ВОВЛЕЧЁННОСТИ.",
}

export function CasesSectionShowcase() {
  return (
    <section className="dark bg-[#0A0A0A] text-[#F0F0F0]">
      <div className="mx-auto w-full max-w-[1512px] px-5 md:px-8 xl:px-14">

        <div className="h-px bg-[#404040]" />

        <div className="flex flex-col lg:flex-row lg:gap-8 pt-10 lg:pt-12 pb-10 lg:pb-12 lg:items-start">

          {/* ── LEFT: Testimonials (static, no scroll) ── */}
          <div className="order-2 lg:order-1 lg:w-[320px] lg:flex-none">
            <div className="flex flex-col gap-4 w-full">
              <span className="flex-none font-['Loos_Condensed',sans-serif] text-[18px] font-medium uppercase tracking-[0.02em] leading-[1.16] text-[#FFCC00]">
                Отзывы
              </span>
              <div className="flex flex-col gap-0 relative overflow-hidden max-h-[480px]"
                style={{
                  maskImage: "linear-gradient(180deg, transparent 0px, #000 40px, #000 calc(100% - 40px), transparent 100%)",
                  WebkitMaskImage: "linear-gradient(180deg, transparent 0px, #000 40px, #000 calc(100% - 40px), transparent 100%)",
                }}
              >
                {DEMO_TESTIMONIALS.map((t, i) => (
                  <div key={i}>
                    <div className="flex items-center gap-3 mb-3 mt-4">
                      <div
                        className="flex-none w-8 h-8 rounded-full bg-[#2a2a2a] bg-cover bg-center"
                        style={{ backgroundImage: `url(${t.avatar})` }}
                      />
                      <div className="flex flex-col">
                        <span className="text-[13px] font-medium text-[#F0F0F0] leading-[1.2]">{t.name}</span>
                        <span className="text-[12px] text-[#6B6B6B] leading-[1.2]">{t.position}</span>
                      </div>
                    </div>
                    <p className="text-[14px] leading-[1.4] tracking-[0.01em] text-[#939393] mb-2">{t.text}</p>
                    {"text2" in t && <p className="text-[14px] leading-[1.4] tracking-[0.01em] text-[#939393] mt-2">{t.text2 as string}</p>}
                    {i < DEMO_TESTIMONIALS.length - 1 && <div className="h-px bg-[#404040] my-5" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Case (static) ── */}
          <div className="flex-1 flex flex-col order-1 lg:order-2 mb-10 lg:mb-0">

            <span className="font-['Loos_Condensed',sans-serif] text-[18px] font-medium uppercase tracking-[0.02em] leading-[1.16] text-[#FFCC00] mb-2">
              {DEMO_CASE.label}
            </span>

            <div className="flex flex-col gap-5 lg:gap-11">
              <div className="flex flex-col gap-5">
                <h2 className="font-heading text-[24px] md:text-[36px] xl:text-[52px] font-bold uppercase leading-[1.08] tracking-[-0.02em] text-[#F0F0F0]">
                  {DEMO_CASE.title}
                </h2>
                <p className="text-[16px] xl:text-[18px] leading-[1.32] text-[#939393] xl:pr-[200px]">
                  {DEMO_CASE.description}
                </p>
              </div>

              {/* Stats */}
              <div className="border border-[#404040] p-5 sm:p-6 xl:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  {DEMO_CASE.stats.map((stat, i) => (
                    <div key={i} className="flex flex-col gap-1 sm:justify-between sm:gap-5">
                      <div className="flex flex-row items-center gap-3">
                        <div className="font-heading text-[40px] xl:text-[52px] font-bold uppercase leading-[1.08] tracking-[-0.02em] text-[#F0F0F0] flex-none">
                          {stat.value}
                        </div>
                        <div className="font-['Loos_Condensed',sans-serif] text-[18px] font-medium uppercase tracking-[0.02em] leading-[1.16] text-[#F0F0F0] whitespace-pre-wrap">
                          {stat.label}
                        </div>
                      </div>
                      <p className="text-[12px] sm:text-[14px] leading-[1.4] tracking-[0.01em] text-[#939393]">
                        {stat.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom row: result + navigator */}
            <div className="mt-5 lg:mt-11 flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-[80px]">
              <p className="font-['Loos_Condensed',sans-serif] text-[16px] font-medium uppercase tracking-[0.04em] leading-[1.16] text-[#F0F0F0] md:flex-1">
                {DEMO_CASE.result}
              </p>
              {/* Static navigator */}
              <div className="flex items-center gap-4 flex-wrap shrink-0">
                {[1, 2, 3, 4, 5].map((n) => (
                  <span key={n} className="flex items-center gap-4">
                    <span className={[
                      "font-['Loos_Condensed',sans-serif] text-[18px] font-medium uppercase tracking-[0.02em] leading-[1.16]",
                      n === 3 ? "text-[#F0F0F0]" : "text-[#939393]",
                    ].join(" ")}>
                      {String(n).padStart(2, "0")}
                    </span>
                    {n === 3 && (
                      <div className="relative flex-none w-[62px] h-[8px]">
                        <div className="absolute inset-x-0 top-[3px] h-[2px] bg-[#404040]" />
                        <div className="absolute left-0 top-[3px] h-[2px] bg-[#F0F0F0]" style={{ width: "55%" }} />
                        <div className="absolute top-0 w-2 h-2 bg-[#F0F0F0]" style={{ left: "calc(55% - 4px)" }} />
                      </div>
                    )}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

        <div className="h-px bg-[#404040]" />

        {/* Logo marquee */}
        <div className="py-8 opacity-55">
          <InfiniteLogoMarquee logos={LOGOS} reverse />
        </div>

        <div className="h-px bg-[#404040]" />

      </div>
    </section>
  )
}
