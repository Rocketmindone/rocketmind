"use client";

import { Plus, Trash2 } from "lucide-react";
import { InlineEdit } from "@/components/inline-edit";

interface ResultsEditorProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

export function ResultsEditor({ data, onUpdate }: ResultsEditorProps) {
  const tag = (data.tag as string) || "";
  const title = (data.title as string) || "";
  const description = (data.description as string) || "";
  const cards = (data.cards as Array<{ title: string; text: string }>) || [];

  function updateCard(index: number, field: string, value: string) {
    const updated = cards.map((c, i) =>
      i === index ? { ...c, [field]: value } : c
    );
    onUpdate({ cards: updated });
  }

  function addCard() {
    onUpdate({ cards: [...cards, { title: "", text: "" }] });
  }

  function removeCard(index: number) {
    onUpdate({ cards: cards.filter((_, i) => i !== index) });
  }

  return (
    <div className="overflow-hidden rounded-sm border-t border-[#404040] bg-[#0A0A0A]">
      <div className="px-8 py-10">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:gap-16">
          <div className="max-w-[560px] lg:w-1/2">
            <InlineEdit
              value={tag}
              onSave={(v) => onUpdate({ tag: v })}
              placeholder="результат"
            >
              <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] uppercase text-[#FFCC00]">
                {tag || "тег"}
              </span>
            </InlineEdit>

            <div className="mt-3">
              <InlineEdit
                value={title}
                onSave={(v) => onUpdate({ title: v })}
                placeholder="Заголовок"
              >
                <h2 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase tracking-tight text-[#F0F0F0] lg:text-[length:var(--text-32)]">
                  {title || "Заголовок"}
                </h2>
              </InlineEdit>
            </div>

            <div className="mt-3">
              <InlineEdit
                value={description}
                onSave={(v) => onUpdate({ description: v })}
                multiline
                placeholder="Описание"
              >
                <p className="text-[length:var(--text-16)] text-[#939393] lg:text-[length:var(--text-18)]">
                  {description || "Описание"}
                </p>
              </InlineEdit>
            </div>
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid gap-2 sm:grid-cols-2">
          {cards.map((card, index) => (
            <div
              key={index}
              className="group/card relative flex h-[200px] flex-col justify-between border border-[#404040] bg-[#FFCC00] p-6"
            >
              <button
                onClick={() => removeCard(index)}
                className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-sm text-[#0A0A0A]/50 opacity-0 transition-opacity hover:text-[#ED4843] group-hover/card:opacity-100"
              >
                <Trash2 className="h-3 w-3" />
              </button>

              <InlineEdit
                value={card.title}
                onSave={(v) => updateCard(index, "title", v)}
                placeholder="Заголовок"
              >
                <span className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-18)] font-bold uppercase text-[#0A0A0A] lg:text-[length:var(--text-24)]">
                  {card.title || "Результат"}
                </span>
              </InlineEdit>

              <InlineEdit
                value={card.text}
                onSave={(v) => updateCard(index, "text", v)}
                multiline
                placeholder="Описание"
              >
                <p className="text-[length:var(--text-14)] text-[#0A0A0A] lg:text-[length:var(--text-16)]">
                  {card.text || "Описание результата"}
                </p>
              </InlineEdit>
            </div>
          ))}

          {/* Add card */}
          <button
            onClick={addCard}
            className="flex h-[200px] items-center justify-center gap-1 border border-dashed border-[#404040] text-[length:var(--text-14)] text-[#939393] transition-colors hover:border-[#FFCC00] hover:text-[#FFCC00]"
          >
            <Plus className="h-3.5 w-3.5" />
            Добавить карточку
          </button>
        </div>
      </div>
    </div>
  );
}
