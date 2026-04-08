"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronDown } from "lucide-react";
import { InlineEdit } from "@/components/inline-edit";

interface AboutEditorProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

export function AboutEditor({ data, onUpdate }: AboutEditorProps) {
  const caption = (data.caption as string) || "";
  const title = (data.title as string) || "";
  const description = (data.description as string) || "";
  const accordion =
    (data.accordion as Array<{ title: string; description: string }>) || [];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
    if (openIndex === index) setOpenIndex(null);
  }

  return (
    <div className="overflow-hidden rounded-sm border-t border-[#404040] bg-[#0A0A0A]">
      <div className="flex flex-col gap-8 px-8 py-10 lg:flex-row lg:gap-16">
        {/* Left: text */}
        <div className="flex max-w-[560px] flex-col gap-4 lg:w-1/2">
          <InlineEdit
            value={caption}
            onSave={(v) => onUpdate({ caption: v })}
            placeholder="О продукте"
          >
            <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] uppercase text-[#FFCC00]">
              {caption || "caption"}
            </span>
          </InlineEdit>

          <InlineEdit
            value={title}
            onSave={(v) => onUpdate({ title: v })}
            placeholder="Заголовок"
          >
            <h2 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase tracking-tight text-[#F0F0F0] lg:text-[length:var(--text-32)]">
              {title || "Заголовок блока"}
            </h2>
          </InlineEdit>

          <InlineEdit
            value={description}
            onSave={(v) => onUpdate({ description: v })}
            multiline
            placeholder="Описание продукта..."
          >
            <p className="text-[length:var(--text-16)] leading-[1.2] text-[#939393] lg:text-[length:var(--text-18)]">
              {description || "Описание"}
            </p>
          </InlineEdit>
        </div>

        {/* Right: accordion */}
        <div className="flex flex-1 flex-col">
          {accordion.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="group/acc relative border-t border-[#404040] last:border-b"
              >
                <button
                  onClick={() => removeAccordion(index)}
                  className="absolute right-0 top-3 z-10 flex h-5 w-5 items-center justify-center rounded-sm text-[#939393] opacity-0 transition-opacity hover:text-[#ED4843] group-hover/acc:opacity-100"
                >
                  <Trash2 className="h-3 w-3" />
                </button>

                <button
                  className="flex w-full items-center gap-3 py-4 pr-8 text-left"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-[#F0F0F0] transition-transform ${isOpen ? "" : "-rotate-90"}`}
                  />
                  <InlineEdit
                    value={item.title}
                    onSave={(v) => updateAccordion(index, "title", v)}
                    placeholder="Заголовок пункта"
                  >
                    <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase text-[#F0F0F0] lg:text-[length:var(--text-16)]">
                      {item.title || "Пункт аккордеона"}
                    </span>
                  </InlineEdit>
                </button>

                {isOpen && (
                  <div className="pb-4 pl-7">
                    <InlineEdit
                      value={item.description}
                      onSave={(v) =>
                        updateAccordion(index, "description", v)
                      }
                      multiline
                      placeholder="Описание пункта"
                    >
                      <p className="text-[length:var(--text-14)] text-[#939393]">
                        {item.description || "Описание"}
                      </p>
                    </InlineEdit>
                  </div>
                )}
              </div>
            );
          })}

          <button
            onClick={addAccordion}
            className="flex items-center justify-center gap-1 border border-dashed border-[#404040] py-4 text-[length:var(--text-14)] text-[#939393] transition-colors hover:border-[#FFCC00] hover:text-[#FFCC00]"
          >
            <Plus className="h-3.5 w-3.5" />
            Добавить пункт
          </button>
        </div>
      </div>
    </div>
  );
}
