"use client";

import { GripVertical } from "lucide-react";
import { InlineEdit } from "@/components/inline-edit";
import { InlineConfirmDelete } from "@/components/inline-confirm";
import { InsertButton } from "@/components/insert-button";
import { useItemDnd } from "@/lib/use-item-dnd";

interface ResultsEditorProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

export function ResultsEditor({ data, onUpdate }: ResultsEditorProps) {
  const tag = (data.tag as string) || "";
  const title = (data.title as string) || "";
  const description = (data.description as string) || "";
  const cards = (data.cards as Array<{ title: string; text: string }>) || [];

  const dnd = useItemDnd(cards, (reordered) => onUpdate({ cards: reordered }));

  function updateCard(index: number, field: string, value: string) {
    const updated = cards.map((c, i) =>
      i === index ? { ...c, [field]: value } : c
    );
    onUpdate({ cards: updated });
  }

  function insertCard(atIndex: number) {
    const next = [...cards];
    next.splice(atIndex, 0, { title: "", text: "" });
    onUpdate({ cards: next });
  }

  function removeCard(index: number) {
    onUpdate({ cards: cards.filter((_, i) => i !== index) });
  }

  return (
    <div className="rounded-sm border-t border-[#404040] bg-[#0A0A0A] pb-20">
      <div className="mx-auto max-w-[1512px] px-5 py-10 md:px-8 xl:px-14">
        {/* Header — top left, max 560px */}
        <div className="mb-8 flex max-w-[560px] flex-col gap-2">
          <InlineEdit
            value={tag}
            onSave={(v) => onUpdate({ tag: v })}
            placeholder="результат"
          >
            <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
              {tag || "тег"}
            </span>
          </InlineEdit>

          <div className="flex flex-col gap-6">
            <InlineEdit
              value={title}
              onSave={(v) => onUpdate({ title: v })}
              placeholder="Заголовок"
            >
              <h2 className="h2 text-[#F0F0F0]">
                {title || "Заголовок"}
              </h2>
            </InlineEdit>

            <InlineEdit
              value={description}
              onSave={(v) => onUpdate({ description: v })}
              multiline
              copy
              placeholder="Описание"
            >
              <p className="text-[length:var(--text-18)] leading-[1.2] text-[#939393]">
                {description || "Описание"}
              </p>
            </InlineEdit>
          </div>
        </div>

        {/* Cards — horizontal row with insert buttons between */}
        <div className="flex items-stretch">
          {cards.map((card, index) => {
            const { draggable, onDragStart, onDragOver, onDrop, onDragEnd, isDragging } =
              dnd.itemProps(index);

            return (
              <div key={index} className="flex flex-1 items-stretch">
                {/* Insert before first / between cards */}
                {cards.length < 4 && (
                  <InsertButton onClick={() => insertCard(index)} />
                )}

                <div
                  draggable={draggable}
                  onDragStart={onDragStart}
                  onDragOver={onDragOver}
                  onDrop={onDrop}
                  onDragEnd={onDragEnd}
                  className={`group/card relative flex h-[240px] min-w-0 flex-1 flex-col justify-between border border-[#FFCC00] bg-[#FFCC00] p-8 transition-all ${
                    isDragging ? "opacity-60" : ""
                  }`}
                >
                  <div className="absolute -right-1 -top-1 z-10 flex items-center gap-0.5 opacity-0 transition-opacity group-hover/card:opacity-100">
                    <div
                      className="flex h-5 w-5 cursor-grab items-center justify-center rounded-sm bg-[#0A0A0A] text-[#F0F0F0] select-none active:cursor-grabbing"
                      onMouseDown={() => dnd.onGripDown(index)}
                      onMouseUp={dnd.onGripUp}
                    >
                      <GripVertical className="h-2.5 w-2.5" />
                    </div>
                    <InlineConfirmDelete
                      onConfirm={() => removeCard(index)}
                      className="bg-[#0A0A0A] text-[#F0F0F0] hover:bg-[#ED4843]"
                    />
                  </div>

                  <InlineEdit
                    value={card.title}
                    onSave={(v) => updateCard(index, "title", v)}
                    placeholder="Заголовок"
                  >
                    <h3 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-20)] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-[#0A0A0A]">
                      {card.title || "Результат"}
                    </h3>
                  </InlineEdit>

                  <InlineEdit
                    value={card.text}
                    onSave={(v) => updateCard(index, "text", v)}
                    multiline
                    copy
                    placeholder="Описание"
                  >
                    <p className="text-[length:var(--text-16)] leading-[1.28] text-[#0A0A0A]">
                      {card.text || "Описание результата"}
                    </p>
                  </InlineEdit>
                </div>
              </div>
            );
          })}

          {/* Insert after last */}
          {cards.length < 4 && (
            <InsertButton onClick={() => insertCard(cards.length)} />
          )}
        </div>
      </div>
    </div>
  );
}
