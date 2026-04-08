"use client";

import { Plus, Trash2 } from "lucide-react";
import { Input, Textarea, Button, Separator } from "@rocketmind/ui";

interface AudienceEditorProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

export function AudienceEditor({ data, onUpdate }: AudienceEditorProps) {
  const tag = (data.tag as string) || "";
  const title = (data.title as string) || "";
  const subtitle = (data.subtitle as string) || "";
  const wideColumn = (data.wideColumn as string) || "left";
  const facts = (data.facts as Array<{ title: string; text: string }>) || [];

  function updateFact(index: number, field: string, value: string) {
    const updated = facts.map((f, i) =>
      i === index ? { ...f, [field]: value } : f
    );
    onUpdate({ facts: updated });
  }

  function addFact() {
    onUpdate({ facts: [...facts, { title: "", text: "" }] });
  }

  function removeFact(index: number) {
    onUpdate({ facts: facts.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-[length:var(--text-12)] text-muted-foreground">
            Тег
          </label>
          <Input
            size="sm"
            value={tag}
            onChange={(e) => onUpdate({ tag: e.target.value })}
            placeholder="Для кого"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[length:var(--text-12)] text-muted-foreground">
            Широкая колонка
          </label>
          <div className="flex gap-2">
            <Button
              variant={wideColumn === "left" ? "default" : "outline"}
              size="xs"
              onClick={() => onUpdate({ wideColumn: "left" })}
            >
              Слева
            </Button>
            <Button
              variant={wideColumn === "right" ? "default" : "outline"}
              size="xs"
              onClick={() => onUpdate({ wideColumn: "right" })}
            >
              Справа
            </Button>
          </div>
        </div>
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
          Подзаголовок
        </label>
        <Textarea
          value={subtitle}
          onChange={(e) => onUpdate({ subtitle: e.target.value })}
          className="min-h-[60px] text-[length:var(--text-14)]"
        />
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[length:var(--text-12)] font-medium text-muted-foreground">
            Факты
          </label>
          <Button variant="ghost" size="xs" onClick={addFact}>
            <Plus className="mr-1 h-3 w-3" />
            Добавить
          </Button>
        </div>

        {facts.map((fact, index) => (
          <div key={index} className="flex items-start gap-2 rounded-sm border border-border p-3">
            <div className="flex flex-1 flex-col gap-2">
              <Input
                size="sm"
                value={fact.title}
                onChange={(e) => updateFact(index, "title", e.target.value)}
                placeholder="Заголовок факта"
              />
              <Textarea
                value={fact.text}
                onChange={(e) => updateFact(index, "text", e.target.value)}
                placeholder="Описание"
                className="min-h-[60px] text-[length:var(--text-14)]"
              />
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => removeFact(index)}
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
