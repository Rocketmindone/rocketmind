"use client";

import { Plus, Trash2 } from "lucide-react";
import { Input, Textarea, Button, Separator } from "@rocketmind/ui";

interface HeroEditorProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

export function HeroEditor({ data, onUpdate }: HeroEditorProps) {
  const caption = (data.caption as string) || "";
  const title = (data.title as string) || "";
  const description = (data.description as string) || "";
  const ctaText = (data.ctaText as string) || "";
  const factoids = (data.factoids as Array<{ number: string; label: string; text: string }>) || [];

  function updateFactoid(index: number, field: string, value: string) {
    const updated = factoids.map((f, i) =>
      i === index ? { ...f, [field]: value } : f
    );
    onUpdate({ factoids: updated });
  }

  function addFactoid() {
    onUpdate({ factoids: [...factoids, { number: "", label: "", text: "" }] });
  }

  function removeFactoid(index: number) {
    onUpdate({ factoids: factoids.filter((_, i) => i !== index) });
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
          placeholder="напр. консалтинг и стратегии"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[length:var(--text-12)] text-muted-foreground">
          Заголовок
        </label>
        <Textarea
          value={title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="ЭКОСИСТЕМНАЯ СТРАТЕГИЯ\nОТ ПРОДУКТА К СЕТИ ПАРТНЁРОВ"
          className="min-h-[80px] text-[length:var(--text-14)]"
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

      <div className="space-y-1.5">
        <label className="text-[length:var(--text-12)] text-muted-foreground">
          Текст кнопки CTA
        </label>
        <Input
          size="sm"
          value={ctaText}
          onChange={(e) => onUpdate({ ctaText: e.target.value })}
          placeholder="Оставить заявку"
        />
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[length:var(--text-12)] font-medium text-muted-foreground">
            Фактоиды
          </label>
          <Button variant="ghost" size="xs" onClick={addFactoid}>
            <Plus className="mr-1 h-3 w-3" />
            Добавить
          </Button>
        </div>

        {factoids.map((factoid, index) => (
          <div key={index} className="flex items-start gap-2 rounded-sm border border-border p-3">
            <div className="grid flex-1 gap-2 sm:grid-cols-3">
              <Input
                size="sm"
                value={factoid.number}
                onChange={(e) => updateFactoid(index, "number", e.target.value)}
                placeholder="150+"
              />
              <Input
                size="sm"
                value={factoid.label}
                onChange={(e) => updateFactoid(index, "label", e.target.value)}
                placeholder="проектов"
              />
              <Input
                size="sm"
                value={factoid.text}
                onChange={(e) => updateFactoid(index, "text", e.target.value)}
                placeholder="описание"
              />
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => removeFactoid(index)}
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
