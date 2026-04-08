"use client";

import { cn } from "../../lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────────

export type Expert = {
  tag?: string;
  name: string;
  bio: string;
  image: string;
};

export type ExpertsSectionProps = {
  experts: Expert[];
  className?: string;
};

// ── Circle pattern SVG (inline, from Figma) ──────────────────────────────────

function CirclePattern({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 698 349"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <circle cx="137.5" cy="104.5" r="88" stroke="#404040" />
      <circle cx="277.5" cy="104.5" r="88" stroke="#404040" />
      <circle cx="417.5" cy="104.5" r="88" stroke="#404040" />
      <circle cx="557.5" cy="104.5" r="88" stroke="#404040" />
      <circle cx="137.5" cy="244.5" r="88" stroke="#404040" />
      <circle cx="417.5" cy="244.5" r="88" stroke="#404040" />
      <circle cx="277.5" cy="244.5" r="88" stroke="#404040" />
      <circle cx="557.5" cy="244.5" r="88" stroke="#404040" />
    </svg>
  );
}

// ── Expert Card — Desktop / Tablet (horizontal) ──────────────────────────────

function ExpertCardHorizontal({ expert }: { expert: Expert }) {
  return (
    <div className="flex bg-[#121212] p-8 gap-8 h-[349px]">
      {/* Photo */}
      <div
        className="w-full h-full shrink-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${expert.image})`,
          flex: "1 1 0",
        }}
      />
      {/* Text */}
      <div className="flex flex-col gap-2 flex-1">
        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
          {expert.tag ?? "Эксперт продукта"}
        </span>
        <div className="flex flex-col gap-6 flex-1">
          <h3 className="h3 text-[#F0F0F0]">{expert.name}</h3>
          <div className="flex-1 flex items-end">
            <p className="text-[length:var(--text-14)] leading-[1.32] tracking-[0.01em] text-[#939393]">
              {expert.bio}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Expert Card — Mobile (vertical) ──────────────────────────────────────────

function ExpertCardVertical({ expert }: { expert: Expert }) {
  return (
    <div className="flex flex-col bg-[#121212] p-5 gap-8">
      {/* Photo */}
      <div
        className="w-full h-[272px] bg-cover bg-center"
        style={{ backgroundImage: `url(${expert.image})` }}
      />
      {/* Text */}
      <div className="flex flex-col gap-2">
        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
          {expert.tag ?? "Эксперт продукта"}
        </span>
        <div className="flex flex-col gap-4">
          <h3 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-28)] font-bold uppercase leading-[1.16] tracking-[-0.01em] text-[#F0F0F0]">
            {expert.name}
          </h3>
          <p className="text-[length:var(--text-16)] leading-[1.28] text-[#939393]">
            {expert.bio}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function ExpertsSection({
  experts,
  className,
}: ExpertsSectionProps) {
  if (experts.length === 0) return null;

  const isOdd = experts.length % 2 !== 0;

  return (
    <section
      className={cn(
        "w-full bg-[#0A0A0A] border-t border-border py-10 md:py-16 lg:py-20",
        className,
      )}
    >
      {/* ── Desktop ── */}
      <div className="hidden lg:block mx-auto max-w-[1512px] px-5 md:px-8 xl:px-14">
        <div className="grid grid-cols-2 gap-1">
          {experts.map((expert, i) => (
            <ExpertCardHorizontal key={i} expert={expert} />
          ))}
          {isOdd && (
            <div className="bg-[#121212] flex items-center justify-center h-[349px] p-4">
              <CirclePattern className="w-full h-full" />
            </div>
          )}
        </div>
      </div>

      {/* ── Tablet ── */}
      <div className="hidden md:block lg:hidden px-8">
        <div className="flex flex-col gap-1">
          {experts.map((expert, i) => (
            <ExpertCardHorizontal key={i} expert={expert} />
          ))}
        </div>
      </div>

      {/* ── Mobile ── */}
      <div className="block md:hidden px-5">
        <div className="flex flex-col gap-1">
          {experts.map((expert, i) => (
            <ExpertCardVertical key={i} expert={expert} />
          ))}
        </div>
      </div>
    </section>
  );
}
