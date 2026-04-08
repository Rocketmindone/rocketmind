"use client";

import { Plus, Trash2 } from "lucide-react";
import { Input, Textarea, Button, Separator } from "@rocketmind/ui";

interface AboutEditorProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

export function AboutEditor({ data, onUpdate }: AboutEditorProps) {
  const caption = (data.caption as string) || "";
  const title = (data.title as string) || "";
  const description = (data.description as string) || "";
  const accordion = (data.accordion as Array<{ title: string; description: string }>) || [];

  function updateAccordion(index: number, field: string, value: string) {
    const updated = accordion.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onUpdate({ accordion: updated });
  }

  function addAccordion() {
    onUpdate({ accordion: [...accordion, { title: "", description: "" }] });
  }

  function removeAccordion(index: number) {
    onUpdate({ accordion: accordion.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-[length:var(--text-12)] text-muted-foreground">
          Надпись (caption)
        </label>
        <Input
          size="sm"
          value={caption}
          onChange={(e) => onUpdate({ caption: e.target.value })}
          placeholder="О продукте"
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
          className="min-h-[80px] text-[length:var(--text-14)]"
        />
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[length:var(--text-12)] font-medium text-muted-foreground">
            Аккордеон
          </label>
          <Button variant="ghost" size="xs" onClick={addAccordion}>
            <Plus className="mr-1 h-3 w-3" />
            Добавить
          </Button>
        </div>

        {accordion.map((item, index) => (
          <div key={index} className="flex items-start gap-2 rounded-sm border border-border p-3">
            <div className="flex flex-1 flex-col gap-2">
              <Input
                size="sm"
                value={item.title}
                onChange={(e) => updateAccordion(index, "title", e.target.value)}
                placeholder="Заголовок пункта"
              />
              <Textarea
                value={item.description}
                onChange={(e) =>
                  updateAccordion(index, "description", e.target.value)
                }
                placeholder="Описание"
                className="min-h-[60px] text-[length:var(--text-14)]"
              />
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => removeAccordion(index)}
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
