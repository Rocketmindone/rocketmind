import Image from "next/image";
import Link from "next/link";

const BASE_PATH = process.env.NODE_ENV === "production" ? "/rocketmind" : "";

/**
 * CTA Yellow — жёлтый вариант с золотым сечением.
 *
 * Figma: 442-1532 (desktop 1401×400) / 443-1546 (mobile 353×571)
 * - Фон: #FFCC00 (--rm-yellow-100)
 * - Текст и кнопка: #0A0A0A (тёмный)
 * - Кнопка: #0A0A0A bg, #F0F0F0 текст — инверсия тёмного CTA
 * - Декор: спираль золотого сечения (белая SVG), правая половина
 */
export function CTASectionYellow() {
  return (
    <section className="bg-[#FFCC00] relative overflow-hidden min-h-[320px] xl:min-h-[400px]">

      {/* ── Golden ratio spiral — right ~46 % of the container ────────── */}
      {/*   Figma: 646×400 px, starts at x:753 in a 1401 px frame        */}
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
      {/*   Figma: x:44, y:44, content-col max-width 764 px, gap 36 px    */}
      <div className="relative z-10 mx-auto w-full max-w-[1512px] px-5 md:px-8 xl:px-14 py-11">
        <div className="flex flex-col gap-9 max-w-[764px]">

          {/* H2 + Copy 18 */}
          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-[28px] md:text-[40px] xl:text-[52px] font-bold uppercase leading-[1.08] tracking-[-0.02em] text-[#0A0A0A]">
              Хотите увидеть, как команда Rocketmind решит вашу стратегическую задачу?
            </h2>
            <p className="text-[15px] xl:text-[18px] leading-[1.2] text-[#0A0A0A] xl:max-w-[672px]">
              Заполните форму — мы проведём экспресс‑оценку ситуации, обозначим возможные сценарии решения и предложим следующий шаг
            </p>
          </div>

          {/* Button — dark, full-width of column (Figma: alignSelf: stretch) */}
          <Link
            href="#contact"
            className="w-full flex items-center justify-center bg-[#0A0A0A] text-[#F0F0F0] px-6 py-[14px] font-['Loos_Condensed',sans-serif] text-[16px] font-medium uppercase tracking-[0.04em] leading-[1.16] rounded-[4px] transition-opacity hover:opacity-85 active:opacity-70"
          >
            оставить заявку
          </Link>

        </div>
      </div>
    </section>
  );
}
