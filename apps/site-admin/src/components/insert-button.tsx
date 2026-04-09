"use client";

import { Plus } from "lucide-react";

interface InsertButtonProps {
  onClick: () => void;
  vertical?: boolean;
}

export function InsertButton({ onClick, vertical = true }: InsertButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`group/ins flex shrink-0 items-center justify-center opacity-0 transition-opacity hover:opacity-100 ${
        vertical
          ? "w-4 self-stretch"
          : "h-4 w-full"
      }`}
    >
      <div
        className={`flex items-center justify-center rounded-sm bg-[var(--rm-violet-100)] text-[var(--rm-violet-fg)] shadow transition-transform group-hover/ins:scale-110 ${
          vertical ? "h-full w-4" : "h-4 w-full"
        }`}
      >
        <Plus className="h-3 w-3" />
      </div>
    </button>
  );
}
