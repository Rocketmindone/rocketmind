"use client";

import type { PageBlock } from "@/lib/types";
import { BLOCK_TYPES } from "@/lib/constants";

interface GenericEditorProps {
  block: PageBlock;
}

export function GenericEditor({ block }: GenericEditorProps) {
  const info = BLOCK_TYPES[block.type];

  if (block.type === "pageBottom") {
    return (
      <div className="flex items-center justify-center bg-[#0A0A0A] py-8">
        <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-wider text-[#939393]">
          ● ● ● Кейсы + CTA — автоматический блок ● ● ●
        </p>
      </div>
    );
  }

  return (
    <div className="py-6 text-center">
      <p className="text-[length:var(--text-14)] text-muted-foreground">
        Блок «{info?.label || block.type}» — настройки будут добавлены позже.
      </p>
    </div>
  );
}
