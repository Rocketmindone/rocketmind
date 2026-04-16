"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";

interface InlineEditProps {
  value: string;
  onSave: (value: string) => void;
  multiline?: boolean;
  /** Kept for backwards compatibility; no longer toggles a toolbar — markdown lists are typed inline. */
  copy?: boolean;
  placeholder?: string;
  children: React.ReactNode;
}

const POPOVER_W = 336;
const NBSP = "\u00A0";

const BULLET_RE = /^(\s*)([-•·–—])\s+/;
const NUMBERED_RE = /^(\s*)(\d+)([.)])\s+/;

/** Returns prefix to insert on the next line, or null if not in a list context.
 *  If the current line is just an empty list marker, returns "" to signal "exit list". */
function continueListPrefix(currentLine: string): { next: string; clearCurrent: boolean } | null {
  const num = currentLine.match(NUMBERED_RE);
  if (num) {
    const [, indent, n, sep] = num;
    const rest = currentLine.slice(num[0].length);
    if (!rest.trim()) return { next: "", clearCurrent: true };
    return { next: `${indent}${Number(n) + 1}${sep} `, clearCurrent: false };
  }
  const bul = currentLine.match(BULLET_RE);
  if (bul) {
    const [, indent, marker] = bul;
    const rest = currentLine.slice(bul[0].length);
    if (!rest.trim()) return { next: "", clearCurrent: true };
    return { next: `${indent}${marker} `, clearCurrent: false };
  }
  return null;
}

export function InlineEdit({
  value,
  onSave,
  multiline = false,
  copy: _copy = false,
  placeholder = "Введите текст...",
  children,
}: InlineEditProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [selRange, setSelRange] = useState<{ start: number; end: number } | null>(null);
  const [caretPos, setCaretPos] = useState<number>(0);
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
      requestAnimationFrame(() => {
        setVisible(true);
        textareaRef.current?.focus();
      });
    } else {
      setVisible(false);
      setSelRange(null);
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
    setCaretPos(start);
    if (start !== end) {
      setSelRange({ start, end });
    } else {
      setSelRange(null);
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
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start, start + replaced.length);
      }
    });
  }

  function insertNewline() {
    if (!textareaRef.current) return;
    const pos = caretPos;
    const newDraft = draft.substring(0, pos) + "\n" + draft.substring(pos);
    setDraft(newDraft);
    setSelRange(null);
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(pos + 1, pos + 1);
        setCaretPos(pos + 1);
      }
    });
  }

  function handleEnter(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    const el = textareaRef.current;
    if (!el) return false;
    const pos = el.selectionStart;
    const before = draft.slice(0, pos);
    const after = draft.slice(el.selectionEnd);
    const lineStart = before.lastIndexOf("\n") + 1;
    const currentLine = before.slice(lineStart);
    const cont = continueListPrefix(currentLine);
    if (!cont) return false;

    e.preventDefault();
    let newDraft: string;
    let caret: number;
    if (cont.clearCurrent) {
      // Empty list item — strip the marker and exit list mode (insert plain newline)
      newDraft = before.slice(0, lineStart) + "\n" + after;
      caret = lineStart + 1;
    } else {
      const insert = "\n" + cont.next;
      newDraft = before + insert + after;
      caret = pos + insert.length;
    }
    setDraft(newDraft);
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(caret, caret);
      }
    });
    return true;
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
                    if (e.key === "Enter") {
                      if (!multiline) {
                        e.preventDefault();
                        handleApply();
                        return;
                      }
                      if (!e.shiftKey) handleEnter(e);
                    }
                  }}
                  placeholder={placeholder}
                  rows={1}
                  className="absolute inset-0 m-2 w-[calc(100%-16px)] resize-none overflow-hidden border-0 bg-transparent px-3 py-2 text-[length:var(--text-14)] leading-5 text-[#F0F0F0] outline-none"
                />
              </div>
              {/* Formatting toolbar */}
              <div className="flex items-center gap-1 border-t border-[#2a2a2a] px-2 py-1.5">
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    insertNbsp();
                  }}
                  disabled={!selRange}
                  title="Заменить пробел(ы) в выделении на неразрывные (чтобы слова не разрывались на строки)"
                  className="flex h-6 items-center gap-1 rounded-sm bg-[var(--rm-violet-100)]/15 px-2 text-[length:var(--text-10)] font-medium text-[var(--rm-violet-100)] transition-colors enabled:hover:bg-[var(--rm-violet-100)] enabled:hover:text-[var(--rm-violet-fg)] disabled:opacity-40"
                >
                  нераз. пробел
                </button>
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    insertNewline();
                  }}
                  title="Вставить принудительный перенос строки в позиции курсора"
                  className="flex h-6 items-center gap-1 rounded-sm bg-[var(--rm-violet-100)]/15 px-2 text-[length:var(--text-10)] font-medium text-[var(--rm-violet-100)] transition-colors hover:bg-[var(--rm-violet-100)] hover:text-[var(--rm-violet-fg)]"
                >
                  ↵ перенос
                </button>
              </div>
            </div>
          </>,
          document.body
        )}
    </span>
  );
}
