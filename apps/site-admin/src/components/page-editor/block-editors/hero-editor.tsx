"use client";

import { Plus, Trash2 } from "lucide-react";
import { InlineEdit } from "@/components/inline-edit";

interface HeroEditorProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

export function HeroEditor({ data, onUpdate }: HeroEditorProps) {
  const caption = (data.caption as string) || "";
  const title = (data.title as string) || "";
  const description = (data.description as string) || "";
  const ctaText = (data.ctaText as string) || "";
  const factoids =
    (data.factoids as Array<{ number: string; label: string; text: string }>) || [];

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
    <div className="overflow-hidden rounded-sm bg-[#0A0A0A]">
      {/* Hero area */}
      <div className="flex flex-col gap-6 px-8 py-10 lg:flex-row lg:gap-10">
        {/* Left: text */}
        <div className="flex flex-1 flex-col gap-4">
          <InlineEdit
            value={caption}
            onSave={(v) => onUpdate({ caption: v })}
            placeholder="напр. консалтинг и стратегии"
          >
            <span className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-18)] font-bold uppercase tracking-tight text-[#FFCC00]">
              {caption || "caption"}
            </span>
          </InlineEdit>

          <InlineEdit
            value={title}
            onSave={(v) => onUpdate({ title: v })}
            multiline
            placeholder="ЗАГОЛОВОК БЛОКА"
          >
            <h1 className="whitespace-pre-line font-[family-name:var(--font-heading-family)] text-[length:var(--text-32)] font-bold uppercase leading-[0.9] tracking-tight text-[#F0F0F0] lg:text-[length:var(--text-52)]">
              {title || "ЗАГОЛОВОК"}
            </h1>
          </InlineEdit>

          <InlineEdit
            value={description}
            onSave={(v) => onUpdate({ description: v })}
            multiline
            placeholder="Описание продукта..."
          >
            <p className="max-w-[560px] text-[length:var(--text-16)] leading-[1.2] text-[#F0F0F0] lg:text-[length:var(--text-18)]">
              {description || "Описание продукта"}
            </p>
          </InlineEdit>
        </div>

        {/* Right: factoids + CTA */}
        <div className="flex w-full flex-col gap-2 lg:w-[344px]">
          {factoids.map((factoid, index) => (
            <div
              key={index}
              className="group/fact relative border border-[#404040] px-5 py-4"
            >
              <button
                onClick={() => removeFactoid(index)}
                className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-sm text-[#939393] opacity-0 transition-opacity hover:text-[#ED4843] group-hover/fact:opacity-100"
              >
                <Trash2 className="h-3 w-3" />
              </button>

              <InlineEdit
                value={factoid.number}
                onSave={(v) => updateFactoid(index, "number", v)}
                placeholder="600+"
              >
                <span className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-32)] font-bold uppercase text-[#F0F0F0] lg:text-[length:var(--text-52)]">
                  {factoid.number || "—"}
                </span>
              </InlineEdit>

              <InlineEdit
                value={factoid.label}
                onSave={(v) => updateFactoid(index, "label", v)}
                placeholder="кейсов платформ"
              >
                <span className="block font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase text-[#F0F0F0] lg:text-[length:var(--text-18)]">
                  {factoid.label || "подпись"}
                </span>
              </InlineEdit>

              <InlineEdit
                value={factoid.text}
                onSave={(v) => updateFactoid(index, "text", v)}
                placeholder="Описание фактоида"
              >
                <span className="block text-[length:var(--text-14)] text-[#939393] lg:text-[length:var(--text-16)]">
                  {factoid.text || "описание"}
                </span>
              </InlineEdit>
            </div>
          ))}

          {/* Add factoid */}
          <button
            onClick={addFactoid}
            className="flex items-center justify-center gap-1 border border-dashed border-[#404040] px-5 py-4 text-[length:var(--text-14)] text-[#939393] transition-colors hover:border-[#FFCC00] hover:text-[#FFCC00]"
          >
            <Plus className="h-3.5 w-3.5" />
            Добавить фактоид
          </button>

          {/* CTA button preview */}
          <div className="mt-1 flex items-center justify-center bg-[#FFCC00] px-5 py-4">
            <InlineEdit
              value={ctaText}
              onSave={(v) => onUpdate({ ctaText: v })}
              placeholder="оставить заявку"
            >
              <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase text-[#0A0A0A]">
                {ctaText || "кнопка"}
              </span>
            </InlineEdit>
          </div>
        </div>
      </div>
    </div>
  );
}
