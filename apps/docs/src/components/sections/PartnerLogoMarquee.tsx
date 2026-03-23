import Image from "next/image";
import type { CSSProperties } from "react";

import type { PartnerLogo } from "@/lib/partner-logos";
import { cn } from "@/lib/utils";

type PartnerLogoMarqueeProps = {
  className?: string;
  contentClassName?: string;
  logos: PartnerLogo[];
  showLens?: boolean;
  speedSeconds?: number;
};

function LogoStrip({
  logos,
  className,
}: {
  logos: PartnerLogo[];
  className?: string;
}) {
  return (
    <>
      {[0, 1].map((copyIndex) => (
        <div
          key={copyIndex}
          aria-hidden={copyIndex === 1}
          className={cn(
            "flex shrink-0 items-center gap-5 pr-5 md:gap-8 md:pr-8 lg:gap-10 lg:pr-10",
            className
          )}
        >
          {logos.map((logo) => (
            <div
              key={`${copyIndex}-${logo.filename}`}
              className="flex min-w-fit items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 backdrop-blur-[2px]"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={160}
                height={56}
                className="h-auto max-h-6 w-auto max-w-[132px] object-contain opacity-90 md:max-h-7 md:max-w-[152px]"
              />
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

export function PartnerLogoMarquee({
  className,
  contentClassName,
  logos,
  showLens = false,
  speedSeconds = 26,
}: PartnerLogoMarqueeProps) {
  if (logos.length === 0) {
    return null;
  }

  const marqueeStyle = {
    "--hero-marquee-duration": `${speedSeconds}s`,
  } as CSSProperties;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] px-4 py-4 md:px-5",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/70 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#0A0A0A] via-[#0A0A0A]/70 to-transparent" />

      <div
        className={cn("partner-logo-marquee-track", contentClassName)}
        style={marqueeStyle}
      >
        <LogoStrip logos={logos} />
      </div>

      {showLens ? (
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 hidden h-[112px] w-[112px] -translate-x-1/2 -translate-y-1/2 md:block">
          <div className="absolute inset-0 overflow-hidden rounded-full border border-white/20 bg-white/[0.08] shadow-[0_0_0_1px_rgba(255,255,255,0.08),inset_0_1px_1px_rgba(255,255,255,0.34)]">
            <div className="absolute inset-0 backdrop-blur-[10px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_28%,rgba(255,255,255,0.35),transparent_42%),radial-gradient(circle_at_72%_76%,rgba(255,204,0,0.2),transparent_55%)]" />
            <div
              className="partner-logo-marquee-track partner-logo-marquee-track--lens absolute inset-y-0 left-0 h-full min-w-max scale-[1.08] saturate-[1.35] contrast-[1.08]"
              style={marqueeStyle}
            >
              <LogoStrip logos={logos} className="gap-5 pr-5 md:gap-8 md:pr-8 lg:gap-10 lg:pr-10" />
            </div>
          </div>
          <div className="absolute inset-[10px] rounded-full border border-white/12" />
        </div>
      ) : null}
    </div>
  );
}
