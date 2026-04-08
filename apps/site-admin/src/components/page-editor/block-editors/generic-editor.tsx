"use client";

import type { PageBlock } from "@/lib/types";
import { BLOCK_TYPES } from "@/lib/constants";

interface GenericEditorProps {
  block: PageBlock;
}

export function GenericEditor({ block }: GenericEditorProps) {
  const info = BLOCK_TYPES[block.type];
  return (
    <div className="py-4 text-center">
      <p className="text-[length:var(--text-14)] text-muted-foreground">
        Блок «{info?.label || block.type}» — настройки этого блока будут добавлены позже.
      </p>
    </div>
  );
}
