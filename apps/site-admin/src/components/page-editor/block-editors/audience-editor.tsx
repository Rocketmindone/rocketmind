"use client";

import { Plus, Trash2 } from "lucide-react";
import { InlineEdit } from "@/components/inline-edit";

interface AudienceEditorProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

export function AudienceEditor({ data, onUpdate }: AudienceEditorProps) {
  const tag = (data.tag as string) || "";
  const title = (data.title as string) || "";
  const subtitle = (data.subtitle as string) || "";
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
    <div className="overflow-hidden rounded-sm border-t border-[#404040] bg-[#F0F0F0]">
      <div className="px-8 py-10">
        {/* Header row */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:gap-16">
          <div className="lg:w-1/2">
            <InlineEdit
              value={tag}
              onSave={(v) => onUpdate({ tag: v })}
              placeholder="для кого"
            >
              <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] uppercase text-[#0A0A0A]">
                {tag || "тег"}
              </span>
            </InlineEdit>

            <div className="mt-3">
              <InlineEdit
                value={title}
                onSave={(v) => onUpdate({ title: v })}
                placeholder="Заголовок"
              >
                <h2 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase tracking-tight text-[#0A0A0A] lg:text-[length:var(--text-32)]">
                  {title || "Заголовок"}
                </h2>
              </InlineEdit>
            </div>
          </div>

          <div className="lg:w-1/2">
            <InlineEdit
              value={subtitle}
              onSave={(v) => onUpdate({ subtitle: v })}
              multiline
              placeholder="Подзаголовок"
            >
              <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] uppercase text-[#0A0A0A] lg:text-[length:var(--text-18)]">
                {subtitle || "Подзаголовок"}
              </p>
            </InlineEdit>
          </div>
        </div>

        {/* Fact cards */}
        <div className="flex flex-col gap-2 lg:flex-row">
          {facts.map((fact, index) => (
            <div
              key={index}
              className="group/fact relative flex flex-1 flex-col gap-2 border-t border-[#404040] pt-4"
            >
              <button
                onClick={() => removeFact(index)}
                className="absolute right-0 top-2 flex h-5 w-5 items-center justify-center rounded-sm text-[#939393] opacity-0 transition-opacity hover:text-[#ED4843] group-hover/fact:opacity-100"
              >
                <Trash2 className="h-3 w-3" />
              </button>

              <InlineEdit
                value={fact.title}
                onSave={(v) => updateFact(index, "title", v)}
                placeholder="Заголовок факта"
              >
                <span className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-18)] font-bold uppercase tracking-tight text-[#0A0A0A] lg:text-[length:var(--text-24)]">
                  {fact.title || "Факт"}
                </span>
              </InlineEdit>

              <InlineEdit
                value={fact.text}
                onSave={(v) => updateFact(index, "text", v)}
                multiline
                placeholder="Описание факта"
              >
                <p className="text-[length:var(--text-14)] text-[#0A0A0A] lg:text-[length:var(--text-16)]">
                  {fact.text || "Описание"}
                </p>
              </InlineEdit>
            </div>
          ))}

          {/* Add fact */}
          <button
            onClick={addFact}
            className="flex flex-1 items-center justify-center gap-1 border border-dashed border-[#404040] py-8 text-[length:var(--text-14)] text-[#939393] transition-colors hover:border-[#0A0A0A] hover:text-[#0A0A0A]"
          >
            <Plus className="h-3.5 w-3.5" />
            Добавить факт
          </button>
        </div>
      </div>
    </div>
  );
}
