"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Trash2 } from "lucide-react";

interface InlineConfirmDeleteProps {
  onConfirm: () => void;
  className?: string;
}

export function InlineConfirmDelete({ onConfirm, className = "" }: InlineConfirmDeleteProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const computePos = useCallback(() => {
    if (!btnRef.current) return { top: 0, left: 0 };
    const rect = btnRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const popW = 160;
    const left = rect.right - popW > 8 ? rect.right - popW : Math.min(rect.left, vw - popW - 8);
    return { top: rect.bottom + 4, left };
  }, []);

  useEffect(() => {
    if (!open) return;
    function tick() {
      setPos(computePos());
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [open, computePos]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (
        popRef.current && !popRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setOpen(!open)}
        className={`flex h-5 w-5 items-center justify-center rounded-sm transition-colors ${className}`}
      >
        <Trash2 className="h-2.5 w-2.5" />
      </button>

      {open &&
        createPortal(
          <div
            ref={popRef}
            style={{ top: pos.top, left: pos.left }}
            className="fixed z-[9999] flex items-center gap-1 rounded-sm border border-[#404040] bg-[#1a1a1a] p-1.5 shadow-xl"
          >
            <span className="px-1.5 text-[length:var(--text-10)] text-[#939393]">
              Удалить?
            </span>
            <button
              onClick={() => { setOpen(false); }}
              className="flex h-6 items-center rounded-sm border border-[#404040] px-2 text-[length:var(--text-10)] text-[#939393] transition-colors hover:border-[#F0F0F0] hover:text-[#F0F0F0]"
            >
              Нет
            </button>
            <button
              onClick={() => { setOpen(false); onConfirm(); }}
              className="flex h-6 items-center rounded-sm bg-[#ED4843] px-2 text-[length:var(--text-10)] text-[#F0F0F0] transition-colors hover:bg-[#d43c37]"
            >
              Да
            </button>
          </div>,
          document.body
        )}
    </>
  );
}
