"use client";

import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────

export type HeroExpert = {
  name: string;
  tag?: string;
  image: string | null;
};

export type HeroExpertsProps = {
  experts: HeroExpert[];
  /** Optional quote shown below the expert block */
  quote?: string;
  /** Max avatars before collapsing the rest into a "+N" counter. Default: 6 */
  maxVisible?: number;
  className?: string;
};

// ── Avatar ────────────────────────────────────────────────────────────────────

function Avatar({
  expert,
  size = 80,
  overlap = false,
  lifted = false,
  isVisible = false,
  onHover,
  onLeave,
}: {
  expert: HeroExpert;
  size?: number;
  overlap?: boolean;
  lifted?: boolean;
  isVisible?: boolean;
  onHover?: () => void;
  onLeave?: () => void;
}) {
  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onHover}
      className={`relative shrink-0 rounded-full border border-[#0A0A0A] bg-[#2a2a2a] bg-cover bg-center transition-transform duration-200 ease-out ${
        overlap ? "-ml-4 first:ml-0" : ""
      } ${lifted ? "-translate-y-2.5" : ""}`}
      style={{
        width: size,
        height: size,
        zIndex: isVisible ? 50 : undefined,
        backgroundImage: expert.image ? `url(${expert.image})` : undefined,
      }}
      aria-label={expert.name}
    >
      {/* ── Tooltip ── */}
      <div
        className="pointer-events-none absolute z-40 bottom-full mb-3 w-[328px] border-l border-[#F0F0F0] bg-[#121212] px-5 py-4"
        style={{
          left: "40px", // Align hint left edge to avatar center
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 300ms ease-out, transform 300ms ease-out",
        }}
      >
        <div className="flex flex-col gap-1">
          <span className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase leading-[1.16] tracking-[-0.01em] text-[#F0F0F0]">
            {expert.name}
          </span>
          {expert.tag && (
            <span className="text-[length:var(--text-14)] leading-[1.32] tracking-[0.01em] text-[#939393]">
              {expert.tag}
            </span>
          )}
        </div>
      </div>

      {!expert.image && (
        <div className="flex h-full w-full items-center justify-center">
          <span className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-18)] font-bold text-[#F0F0F0]">
            {expert.name.slice(0, 1)}
          </span>
        </div>
      )}
    </div>
  );
}

// ── Counter circle ("+N") ─────────────────────────────────────────────────────

function CounterAvatar({ count, size = 80 }: { count: number; size?: number }) {
  return (
    <div
      className="relative shrink-0 -ml-4 flex items-center justify-center rounded-full border border-[#0A0A0A] bg-[#1A1A1A]"
      style={{ width: size, height: size }}
    >
      <span className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-[#F0F0F0]">
        +{count}
      </span>
    </div>
  );
}

// ── Single-expert variant ─────────────────────────────────────────────────────

function SingleExpert({ expert, quote }: { expert: HeroExpert; quote?: string }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Avatar expert={expert} size={80} isVisible={false} />
        <div className="flex flex-col justify-center gap-1">
          <span className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase leading-[1.16] tracking-[-0.01em] text-[#F0F0F0]">
            {expert.name}
          </span>
          {expert.tag && (
            <span className="text-[length:var(--text-14)] leading-[1.32] tracking-[0.01em] text-[#939393]">
              {expert.tag}
            </span>
          )}
        </div>
      </div>
      {quote && (
        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#939393]">
          {quote}
        </span>
      )}
    </div>
  );
}

// ── Multi-expert variant (Cross-fade tooltips) ───────────────────────────────

function MultiExperts({
  experts,
  quote,
  maxVisible,
}: {
  experts: HeroExpert[];
  quote?: string;
  maxVisible: number;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const overflow = experts.length > maxVisible;
  const visible = overflow ? experts.slice(0, maxVisible - 1) : experts;
  const extraCount = overflow ? experts.length - (maxVisible - 1) : 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="relative z-30">
        <div className="flex items-center">
          {visible.map((expert, i) => (
            <Avatar
              key={`${expert.name}-${i}`}
              expert={expert}
              size={80}
              overlap={i > 0}
              lifted={activeIndex === i}
              isVisible={activeIndex === i}
              onHover={() => setActiveIndex(i)}
              onLeave={() => setActiveIndex((prev) => (prev === i ? null : prev))}
            />
          ))}
          {overflow && <CounterAvatar count={extraCount} size={80} />}
        </div>
      </div>

      {quote && (
        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#939393]">
          {quote}
        </span>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function HeroExperts({
  experts,
  quote,
  maxVisible = 6,
  className,
}: HeroExpertsProps) {
  if (experts.length === 0) return null;

  return (
    <div className={className}>
      {experts.length === 1 ? (
        <SingleExpert expert={experts[0]} quote={quote} />
      ) : (
        <MultiExperts experts={experts} quote={quote} maxVisible={maxVisible} />
      )}
    </div>
  );
}
