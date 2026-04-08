"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";

interface InlineEditProps {
  value: string;
  onSave: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
  children: React.ReactNode;
}

export function InlineEdit({
  value,
  onSave,
  multiline = false,
  placeholder = "Введите текст...",
  children,
}: InlineEditProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [visible, setVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing) {
      // trigger enter animation on next frame
      requestAnimationFrame(() => setVisible(true));
      inputRef.current?.focus();
    } else {
      setVisible(false);
    }
  }, [editing]);

  useEffect(() => {
    setDraft(value);
  }, [value]);

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

      {/* Icons — top-left of the element */}
      <span className="absolute -left-3 -top-3 z-20 flex items-center gap-0.5">
        {editing ? (
          <>
            {/* Cancel */}
            <button
              onClick={handleCancel}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-[#404040] bg-[#1a1a1a] text-[#939393] shadow-md transition-colors hover:border-[#F0F0F0] hover:text-[#F0F0F0]"
            >
              <X className="h-3 w-3" />
            </button>
            {/* Apply */}
            <button
              onClick={handleApply}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--rm-yellow-100)] text-[var(--rm-yellow-fg)] shadow-md transition-colors hover:bg-[var(--rm-yellow-700)]"
            >
              <Check className="h-3 w-3" />
            </button>
          </>
        ) : (
          /* Edit */
          <button
            onClick={handleOpen}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--rm-yellow-100)] text-[var(--rm-yellow-fg)] opacity-0 shadow-md transition-all hover:bg-[var(--rm-yellow-700)] group-hover/edit:opacity-100"
          >
            <Pencil className="h-2.5 w-2.5" />
          </button>
        )}
      </span>

      {/* Floating input — anchored below the icons, centered under them */}
      {editing && (
        <div
          className={`absolute -left-3 top-4 z-30 w-[320px] origin-top rounded-sm border border-[var(--rm-yellow-300)] bg-[#1a1a1a] p-2 shadow-xl transition-all duration-200 ease-out ${
            visible
              ? "translate-y-0 scale-100 opacity-100"
              : "-translate-y-1 scale-95 opacity-0"
          }`}
        >
          {multiline ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={placeholder}
              rows={3}
              className="w-full resize-y rounded-sm border border-[#404040] bg-[#0a0a0a] px-3 py-2 text-[length:var(--text-14)] text-[#F0F0F0] outline-none focus:border-[var(--rm-yellow-300)]"
            />
          ) : (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={placeholder}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleApply();
              }}
              className="w-full rounded-sm border border-[#404040] bg-[#0a0a0a] px-3 py-2 text-[length:var(--text-14)] text-[#F0F0F0] outline-none focus:border-[var(--rm-yellow-300)]"
            />
          )}
        </div>
      )}
    </span>
  );
}
