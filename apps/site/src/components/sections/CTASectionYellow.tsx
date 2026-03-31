import Image from "next/image";
import Link from "next/link";

const BASE_PATH = process.env.NODE_ENV === "production" ? "/rocketmind" : "";

/**
 * CTA Yellow — жёлтый вариант с золотым сечением.
 *
 * Figma: 442-1532 (desktop 1401×400) / 443-1546 (mobile 353×571)
 * - Фон: #FFCC00 (--rm-yellow-100)
 * - Текст и кнопка: #0A0A0A (тёмный)
 * - Кнопка: #0A0A0A bg, #F0F0F0 текст; desktop = hug width, mobile = stretch
 * - Декор desktop: спираль 646×400 px, x:753 в 1401 px фрейме (правые ~47%)
 * - Декор mobile:  спираль 353×571 px, абсолютная, полный фрейм
 */
export function CTASectionYellow() {
  return (
    <section className="bg-[#FFCC00] relative overflow-hidden min-h-[320px] xl:min-h-[400px]">

      {/* ── Mobile spiral — full-frame 353×571, absolute, hidden on md+ ── */}
      <div
        className="absolute inset-0 pointer-events-none md:hidden"
        aria-hidden="true"
      >
        <Image
          src={`${BASE_PATH}/images/cta/golden-spiral-mobile.svg`}
          alt=""
          fill
          className="object-cover object-center"
          unoptimized
        />
      </div>

      {/* ── Desktop spiral — right ~47%, Figma x:753 in 1401 px frame ── */}
      <div
        className="absolute right-0 top-0 h-full w-[47%] pointer-events-none hidden md:block"
        aria-hidden="true"
      >
        <Image
          src={`${BASE_PATH}/images/cta/golden-spiral.svg`}
          alt=""
          fill
          className="object-left object-top"
          unoptimized
        />
      </div>

      {/* ── Content ────────────────────────────────────────────────────── */}
      {/*   Figma desktop: x:44, y:44, content-col 764 px, gap 36 px      */}
      {/*   Figma mobile:  padding 20px, gap 40px (layout_XF8CB7)          */}
      <div className="relative z-10 mx-auto w-full max-w-[1512px] px-5 md:px-8 xl:px-14 py-11">
        <div className="flex flex-col gap-9 max-w-[764px]">

          {/* H2 + body copy */}
          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-[28px] md:text-[40px] xl:text-[52px] font-bold uppercase leading-[1.08] tracking-[-0.02em] text-[#0A0A0A]">
              Хотите увидеть, как команда Rocketmind решит вашу стратегическую задачу?
            </h2>
            <p className="text-[14px] md:text-[15px] xl:text-[18px] leading-[1.32] text-[#0A0A0A] xl:max-w-[672px]">
              Заполните форму — мы проведём экспресс‑оценку ситуации, обозначим возможные сценарии решения и предложим следующий шаг
            </p>
          </div>

          {/* Button — mobile: full-width (Figma alignSelf:stretch)
                      desktop: hug width (Figma sizing:hug)             */}
          <Link
            href="#contact"
            className="w-full md:w-fit flex items-center justify-center bg-[#0A0A0A] text-[#F0F0F0] px-6 py-[14px] font-['Loos_Condensed',sans-serif] text-[16px] font-medium uppercase tracking-[0.04em] leading-[1.16] rounded-[4px] transition-opacity hover:opacity-85 active:opacity-70"
          >
            оставить заявку
          </Link>

        </div>
      </div>
    </section>
  );
}
