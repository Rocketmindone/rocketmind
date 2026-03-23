import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const tracks = [
  "Консалтинг и стратегии",
  "Онлайн-школа",
  "AI-продукты",
];

const cards = [
  {
    title: "Архитектура устойчивых экосистем",
    description:
      "Создадим стратегию и портфель бизнес-моделей, которые расширят влияние и сделают бизнес более устойчивым",
    image: "/service-cards/ecosystems.png",
    alt: "Архитектура устойчивых экосистем",
  },
  {
    title: "Стратегические и дизайн-сессии",
    description:
      "Организуем рабочие сессии для поиска решений, запуска гипотез и формирования общего видения",
    image: "/service-cards/sessions.png",
    alt: "Стратегические и дизайн-сессии",
  },
  {
    title: "Цифровая платформа в вашем бизнесе",
    description:
      "Находим платформенную логику, чтобы масштабироваться, запускать новые рынки и повышать ценность",
    image: "/service-cards/platform.png",
    alt: "Цифровая платформа в вашем бизнесе",
  },
];

export function ServicesGrid() {
  return (
    <section
      className="bg-background pb-12 text-foreground dark md:pb-16"
      id="focus"
    >
      <div className="mx-auto max-w-[1512px] px-5 md:px-8 xl:px-14">
        <div className="grid gap-10 border-t border-border pt-14 xl:grid-cols-[344px_minmax(0,1048px)] xl:items-start xl:justify-between">
          <div className="flex flex-col gap-4 pt-1">
            {tracks.map((track, index) => (
              <div
                key={track}
                className={[
                  "relative flex min-h-7 items-center",
                  index === 0 ? "text-foreground" : "text-muted-foreground",
                ].join(" ")}
              >
                <p className="font-heading text-[24px] font-bold uppercase leading-[1.2] tracking-[-0.01em]">
                  {track}
                </p>
                {index === 0 ? (
                  <span className="absolute -bottom-[2px] left-0 h-[2px] w-[276px] bg-[var(--rm-yellow-100)]" />
                ) : null}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex max-w-[696px] flex-col gap-5">
                <div className="max-w-[666px] font-heading text-[52px] font-bold uppercase leading-[1.08] tracking-[-0.02em]">
                  <p className="text-foreground">Три фокуса Rocketmind</p>
                  <p className="text-muted-foreground">Стратегия и бизнес-модели</p>
                </div>
                <p className="h-[68px] max-w-[696px] text-[18px] leading-[1.2] text-muted-foreground">
                  Помогаем командам искать, проверять и усиливать бизнес-модели, связывать стратегию с операционными действиями и переходить от продуктовой логики к платформенной архитектуре.
                </p>
              </div>

              <div className="flex items-center gap-5 self-end text-muted-foreground">
                <ChevronLeft size={16} strokeWidth={1.8} />
                <ChevronRight size={16} strokeWidth={1.8} />
              </div>
            </div>

            <div className="grid gap-0 md:grid-cols-2 xl:grid-cols-3">
              {cards.map((card) => (
                <article
                  key={card.title}
                  className="flex h-[508px] flex-col border border-border px-8 py-8 first:mr-[-1px] md:[&:not(:first-child)]:ml-[-1px]"
                >
                  <div className="flex h-full flex-col gap-14">
                    <div className="relative h-[204px] w-full overflow-hidden bg-[#131313]">
                      <Image
                        src={card.image}
                        alt={card.alt}
                        fill
                        className="object-cover opacity-80"
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between gap-6">
                      <div className="flex flex-col gap-2">
                        <h3 className="font-heading text-[24px] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-foreground">
                          {card.title}
                        </h3>
                        <p className="text-[14px] leading-[1.32] tracking-[0.01em] text-muted-foreground">
                          {card.description}
                        </p>
                      </div>

                      <Link
                        href="#contact"
                        className="flex h-10 items-center justify-center rounded-sm border border-border bg-[var(--rm-gray-1)] px-5 font-mono text-[14px] uppercase tracking-[0.04em] text-foreground transition-[background-color,border-color,opacity] duration-150 hover:bg-[var(--rm-gray-2)]"
                      >
                        Подробнее
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
