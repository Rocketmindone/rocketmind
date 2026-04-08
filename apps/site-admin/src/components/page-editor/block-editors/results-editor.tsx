"use client";

import { Plus, Trash2 } from "lucide-react";
import { Input, Textarea, Button, Separator } from "@rocketmind/ui";

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
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-[length:var(--text-12)] text-muted-foreground">
          Тег
        </label>
        <Input
          size="sm"
          value={tag}
          onChange={(e) => onUpdate({ tag: e.target.value })}
          placeholder="Результаты"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[length:var(--text-12)] text-muted-foreground">
          Заголовок
        </label>
        <Input
          size="sm"
          value={title}
          onChange={(e) => onUpdate({ title: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[length:var(--text-12)] text-muted-foreground">
          Описание
        </label>
        <Textarea
          value={description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          className="min-h-[60px] text-[length:var(--text-14)]"
        />
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[length:var(--text-12)] font-medium text-muted-foreground">
            Карточки результатов
          </label>
          <Button variant="ghost" size="xs" onClick={addCard}>
            <Plus className="mr-1 h-3 w-3" />
            Добавить
          </Button>
        </div>

        {cards.map((card, index) => (
          <div key={index} className="flex items-start gap-2 rounded-sm border border-border p-3">
            <div className="flex flex-1 flex-col gap-2">
              <Input
                size="sm"
                value={card.title}
                onChange={(e) => updateCard(index, "title", e.target.value)}
                placeholder="Заголовок"
              />
              <Textarea
                value={card.text}
                onChange={(e) => updateCard(index, "text", e.target.value)}
                placeholder="Описание результата"
                className="min-h-[60px] text-[length:var(--text-14)]"
              />
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => removeCard(index)}
              className="shrink-0 text-muted-foreground hover:text-[var(--rm-red-500)]"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
