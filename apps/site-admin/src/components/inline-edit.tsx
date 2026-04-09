"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Pencil, Check, X, List, ListOrdered, AlignLeft } from "lucide-react";
import { toast } from "sonner";

type ListMode = "none" | "bullet" | "numbered";

interface InlineEditProps {
  value: string;
  onSave: (value: string) => void;
  multiline?: boolean;
  copy?: boolean;
  placeholder?: string;
  children: React.ReactNode;
}

const POPOVER_W = 336;
const NBSP = "\u00A0";

function detectListMode(text: string): ListMode {
  const lines = text.split("\n").filter((l) => l.trim());
  if (lines.length === 0) return "none";
  if (lines.every((l) => /^[•·–—-]\s/.test(l.trim()))) return "bullet";
  if (lines.every((l) => /^\d+[.)]\s/.test(l.trim()))) return "numbered";
  return "none";
}

function toListMode(text: string, from: ListMode, to: ListMode): string {
  const lines = text.split("\n").filter((l) => l.trim());
  // Strip existing prefixes
  const stripped = lines.map((l) =>
    l.trim().replace(/^[•·–—-]\s*/, "").replace(/^\d+[.)]\s*/, "")
  );
  if (to === "bullet") return stripped.map((l) => `• ${l}`).join("\n");
  if (to === "numbered") return stripped.map((l, i) => `${i + 1}. ${l}`).join("\n");
  return stripped.join("\n");
}

export function InlineEdit({
  value,
  onSave,
  multiline = false,
  copy = false,
  placeholder = "Введите текст...",
  children,
}: InlineEditProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [selRange, setSelRange] = useState<{ start: number; end: number } | null>(null);
  const [nbspPos, setNbspPos] = useState<{ top: number; left: number } | null>(null);
  const [listMode, setListMode] = useState<ListMode>("none");
  const iconsRef = useRef<HTMLSpanElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const rafRef = useRef<number>(0);

  const computePos = useCallback(() => {
    if (!iconsRef.current) return { top: 0, left: 0 };
    const rect = iconsRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const spaceRight = vw - rect.left;
    const left =
      spaceRight >= POPOVER_W + 16
        ? rect.left
        : Math.max(8, rect.right - POPOVER_W);
    return { top: rect.bottom + 4, left };
  }, []);

  useEffect(() => {
    if (!editing) return;
    function tick() {
      setPos(computePos());
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [editing, computePos]);

  useEffect(() => {
    if (editing) {
      setPos(computePos());
      setListMode(detectListMode(value));
      requestAnimationFrame(() => {
        setVisible(true);
        textareaRef.current?.focus();
      });
    } else {
      setVisible(false);
      setSelRange(null);
      setNbspPos(null);
    }
  }, [editing, computePos, value]);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  function handleSelect() {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    if (start !== end) {
      setSelRange({ start, end });
      const elRect = el.getBoundingClientRect();
      const textBefore = draft.substring(0, start);
      const lines = textBefore.split("\n");
      const lastLine = lines[lines.length - 1];
      const charW = 8;
      const lineH = 20;
      const xOffset = Math.min(lastLine.length * charW, el.clientWidth - 80);
      const yOffset = (lines.length - 1) * lineH;
      setNbspPos({
        top: elRect.top - 28 + yOffset,
        left: elRect.left + xOffset,
      });
    } else {
      setSelRange(null);
      setNbspPos(null);
    }
  }

  function insertNbsp() {
    if (!selRange || !textareaRef.current) return;
    const { start, end } = selRange;
    const selected = draft.substring(start, end);
    const replaced = selected.replace(/ /g, NBSP);
    const newDraft = draft.substring(0, start) + replaced + draft.substring(end);
    setDraft(newDraft);
    setSelRange(null);
    setNbspPos(null);
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start, start + replaced.length);
      }
    });
  }

  function handleSetListMode(mode: ListMode) {
    const newDraft = toListMode(draft, listMode, mode);
    setDraft(newDraft);
    setListMode(mode);
  }

  function handleOpen() {
    setDraft(value);
    setEditing(true);
  }

  function handleApply() {
    onSave(draft);
    setEditing(false);
    if (draft !== value) {
      toast.success("Изменено");
    }
  }

  function handleCancel() {
    setDraft(value);
    setEditing(false);
  }

  return (
    <span className="group/edit relative">
      {children}

      <span
        ref={iconsRef}
        className="absolute left-0 -top-3 z-20 flex items-center gap-0.5"
      >
        {editing ? (
          <>
            <button
              onClick={handleCancel}
              className="flex h-6 items-center gap-1 rounded-sm border border-[#404040] bg-[#1a1a1a] px-2 text-[length:var(--text-10)] text-[#939393] shadow-md transition-colors hover:border-[#F0F0F0] hover:text-[#F0F0F0]"
            >
              <X className="h-3 w-3" />
              Отмена
            </button>
            <button
              onClick={handleApply}
              className="flex h-6 items-center gap-1 rounded-sm bg-[var(--rm-yellow-100)] px-2 text-[length:var(--text-10)] text-[var(--rm-yellow-fg)] shadow-md transition-colors hover:bg-[var(--rm-yellow-700)]"
            >
              <Check className="h-3 w-3" />
              Применить
            </button>
          </>
        ) : (
          <button
            onClick={handleOpen}
            className="flex h-6 w-6 items-center justify-center rounded-sm bg-[var(--rm-violet-100)]/15 text-[var(--rm-violet-100)] transition-all hover:bg-[var(--rm-violet-100)] hover:text-[var(--rm-violet-fg)] hover:shadow-md"
          >
            <Pencil className="h-2.5 w-2.5" />
          </button>
        )}
      </span>

      {editing &&
        createPortal(
          <>
            <div
              style={{ top: pos.top, left: pos.left, width: POPOVER_W }}
              className={`fixed z-[9999] origin-top rounded-sm border border-[var(--rm-violet-300)] bg-[#1a1a1a] shadow-xl transition-opacity duration-200 ease-out ${
                visible ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* List mode toggle — only for copy variant */}
              {copy && (
                <div className="flex items-center gap-0.5 border-b border-[#404040] px-2 py-1">
                  <button
                    onMouseDown={(e) => { e.preventDefault(); handleSetListMode("none"); }}
                    className={`flex h-6 w-6 items-center justify-center rounded-sm transition-colors ${
                      listMode === "none"
                        ? "bg-[var(--rm-violet-100)] text-[var(--rm-violet-fg)]"
                        : "text-[#939393] hover:text-[#F0F0F0]"
                    }`}
                  >
                    <AlignLeft className="h-3 w-3" />
                  </button>
                  <button
                    onMouseDown={(e) => { e.preventDefault(); handleSetListMode("bullet"); }}
                    className={`flex h-6 w-6 items-center justify-center rounded-sm transition-colors ${
                      listMode === "bullet"
                        ? "bg-[var(--rm-violet-100)] text-[var(--rm-violet-fg)]"
                        : "text-[#939393] hover:text-[#F0F0F0]"
                    }`}
                  >
                    <List className="h-3 w-3" />
                  </button>
                  <button
                    onMouseDown={(e) => { e.preventDefault(); handleSetListMode("numbered"); }}
                    className={`flex h-6 w-6 items-center justify-center rounded-sm transition-colors ${
                      listMode === "numbered"
                        ? "bg-[var(--rm-violet-100)] text-[var(--rm-violet-fg)]"
                        : "text-[#939393] hover:text-[#F0F0F0]"
                    }`}
                  >
                    <ListOrdered className="h-3 w-3" />
                  </button>
                </div>
              )}

              <div className="relative p-2">
                {/* Highlight layer — renders nbsp markers */}
                <div
                  aria-hidden
                  className="pointer-events-none whitespace-pre-wrap break-words px-3 py-2 text-[length:var(--text-14)] leading-5 text-transparent"
                >
                  {draft.split("").map((ch, i) =>
                    ch === NBSP ? (
                      <span key={i} className="rounded-sm bg-[var(--rm-violet-100)]/25 text-[var(--rm-violet-100)]">·</span>
                    ) : (
                      <span key={i}>{ch}</span>
                    )
                  )}
                  {!draft && <span className="text-transparent">{placeholder}</span>}
                </div>
                {/* Textarea on top */}
                <textarea
                  ref={textareaRef}
                  value={draft}
                  onChange={(e) => {
                    setDraft(e.target.value);
                  }}
                  onSelect={handleSelect}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !multiline) {
                      e.preventDefault();
                      handleApply();
                    }
                  }}
                  placeholder={placeholder}
                  rows={1}
                  className="absolute inset-0 m-2 w-[calc(100%-16px)] resize-none overflow-hidden border-0 bg-transparent px-3 py-2 text-[length:var(--text-14)] leading-5 text-[#F0F0F0] outline-none"
                />
              </div>
            </div>

            {/* Nbsp button */}
            {selRange && nbspPos && (
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  insertNbsp();
                }}
                style={{ top: nbspPos.top, left: nbspPos.left }}
                className="fixed z-[10000] flex h-6 items-center gap-1 rounded-sm bg-[var(--rm-violet-100)] px-2 text-[length:var(--text-10)] font-medium text-[var(--rm-violet-fg)] shadow-lg transition-colors hover:bg-[var(--rm-violet-700)]"
              >
                nbsp
              </button>
            )}
          </>,
          document.body
        )}
    </span>
  );
}
