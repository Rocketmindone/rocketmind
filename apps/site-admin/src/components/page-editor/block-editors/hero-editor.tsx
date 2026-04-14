"use client";

import { useRef } from "react";
import { GripVertical, ImagePlus, ArrowUpRight, Upload, Trash2 } from "lucide-react";
import { InlineEdit } from "@/components/inline-edit";
import { useItemDnd } from "@/lib/use-item-dnd";

interface HeroEditorProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

export function HeroEditor({ data, onUpdate }: HeroEditorProps) {
  const iconInputRef = useRef<HTMLInputElement>(null);
  const caption = (data.caption as string) || "";
  const title = (data.title as string) || "";
  const description = (data.description as string) || "";
  const ctaText = (data.ctaText as string) || "";
  const heroImageData = (data.heroImageData as string) || "";
  const factoids =
    (data.factoids as Array<{ number: string; label: string; text: string }>) || [];

  // Ensure exactly 3 factoids
  const normalized = [...factoids];
  while (normalized.length < 3) {
    normalized.push({ number: "", label: "", text: "" });
  }
  const displayFactoids = normalized.slice(0, 3);

  const dnd = useItemDnd(displayFactoids, (reordered) =>
    onUpdate({ factoids: reordered })
  );

  function updateFactoid(index: number, field: string, value: string) {
    const updated = displayFactoids.map((f, i) =>
      i === index ? { ...f, [field]: value } : f
    );
    onUpdate({ factoids: updated });
  }

  return (
    <div className="rounded-sm bg-[#0A0A0A] pb-20">
      <div className="mx-auto flex max-w-[1512px] flex-col lg:flex-row">
        {/* Left: icon at top, text pushed to bottom */}
        <div className="relative flex flex-1 flex-col px-5 py-10 md:px-8 lg:min-h-[600px] xl:pl-14">
          {/* Cover icon — linked with card icon */}
          {heroImageData ? (
            <div className="group/icon relative mb-8 h-[156px] w-[156px]">
              <div
                className="h-full w-full rounded-sm bg-contain bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${heroImageData})` }}
              />
              <div className="absolute left-1 top-1 flex items-center gap-1 opacity-0 transition-opacity group-hover/icon:opacity-100">
                <button
                  type="button"
                  onClick={() => iconInputRef.current?.click()}
                  className="flex h-6 items-center gap-1 rounded-sm bg-[#1a1a1a]/80 px-1.5 text-[length:var(--text-10)] text-[#F0F0F0] backdrop-blur hover:bg-[#1a1a1a]"
                >
                  <Upload className="h-3 w-3" />
                  Заменить
                </button>
                <button
                  type="button"
                  onClick={() => onUpdate({ heroImageData: "" })}
                  className="flex h-6 w-6 items-center justify-center rounded-sm bg-[#1a1a1a]/80 text-[#F0F0F0] backdrop-blur hover:bg-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => iconInputRef.current?.click()}
              className="mb-8 flex h-[156px] w-[156px] cursor-pointer items-center justify-center rounded-sm border border-dashed border-[#404040] text-[#939393] transition-colors hover:border-[#FFCC00] hover:text-[#FFCC00]"
            >
              <div className="flex flex-col items-center gap-1">
                <ImagePlus className="h-6 w-6" />
                <span className="text-[length:var(--text-10)]">Иконка продукта</span>
              </div>
            </button>
          )}
          <input
            ref={iconInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => onUpdate({ heroImageData: reader.result as string });
              reader.readAsDataURL(file);
              e.target.value = "";
            }}
            className="hidden"
          />

          {/* Text — pushed to bottom */}
          <div className="mt-auto flex flex-col gap-6 lg:gap-11 lg:pr-10">
            <div className="flex flex-col gap-4 lg:gap-6">
              <InlineEdit
                value={caption}
                onSave={(v) => onUpdate({ caption: v })}
                placeholder="напр. консалтинг и стратегии"
              >
                <span className="h4 text-[#FFCC00]">
                  {caption || "caption"}
                </span>
              </InlineEdit>

              <InlineEdit
                value={title}
                onSave={(v) => onUpdate({ title: v })}
                multiline
                placeholder="ЗАГОЛОВОК БЛОКА"
              >
                <h1 className="h1 whitespace-pre-line text-[#F0F0F0]">
                  {title || "ЗАГОЛОВОК"}
                </h1>
              </InlineEdit>
            </div>

            <InlineEdit
              value={description}
              onSave={(v) => onUpdate({ description: v })}
              multiline
              copy
              placeholder="Описание продукта..."
            >
              <p className="max-w-[696px] text-[length:var(--text-18)] leading-[1.2] text-[#F0F0F0]">
                {description || "Описание продукта"}
              </p>
            </InlineEdit>
          </div>
        </div>

        {/* Right: 3 factoids + CTA — fixed 344px */}
        <div className="flex w-full shrink-0 flex-col lg:w-[344px]">
          {displayFactoids.map((factoid, index) => {
            const { draggable, onDragStart, onDragOver, onDrop, onDragEnd, isDragging } =
              dnd.itemProps(index);

            return (
              <div
                key={index}
                draggable={draggable}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onDragEnd={onDragEnd}
                className={`group/fact relative flex h-[189px] flex-col justify-between border-b border-l border-r border-[#404040] p-5 transition-all lg:p-7 ${
                  isDragging ? "opacity-60" : ""
                }`}
              >
                {/* Drag handle — top right */}
                <div className="absolute -right-1 -top-1 z-10 flex items-center gap-0.5 opacity-0 transition-opacity group-hover/fact:opacity-100">
                  <div
                    className="flex h-5 w-5 cursor-grab items-center justify-center rounded-sm bg-[#F0F0F0] text-[#0A0A0A] select-none active:cursor-grabbing"
                    onMouseDown={() => dnd.onGripDown(index)}
                    onMouseUp={dnd.onGripUp}
                  >
                    <GripVertical className="h-2.5 w-2.5" />
                  </div>
                </div>

                {/* Top row: number + label side by side */}
                <div className="flex items-center gap-5">
                  <InlineEdit
                    value={factoid.number}
                    onSave={(v) => updateFactoid(index, "number", v)}
                    placeholder="600+"
                  >
                    <span className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-52)] font-bold uppercase leading-[1.08] tracking-[-0.02em] text-[#F0F0F0]">
                      {factoid.number || "—"}
                    </span>
                  </InlineEdit>

                  <InlineEdit
                    value={factoid.label}
                    onSave={(v) => updateFactoid(index, "label", v)}
                    placeholder="кейсов платформ"
                  >
                    <span className="inline-block w-[127px] font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#F0F0F0]">
                      {factoid.label || "подпись"}
                    </span>
                  </InlineEdit>
                </div>

                {/* Bottom: description */}
                <InlineEdit
                  value={factoid.text}
                  onSave={(v) => updateFactoid(index, "text", v)}
                  multiline
                  placeholder="Описание фактоида"
                >
                  <p className="text-[length:var(--text-16)] leading-[1.28] text-[#939393]">
                    {factoid.text || "описание"}
                  </p>
                </InlineEdit>
              </div>
            );
          })}

          {/* CTA button — matches original design */}
          <div className="flex flex-1 flex-col justify-between bg-[#FFCC00] p-5 lg:min-h-[189px] lg:p-7">
            <div className="flex w-full justify-end">
              <ArrowUpRight className="h-8 w-8 text-[#0A0A0A]" strokeWidth={3} />
            </div>
            <InlineEdit
              value={ctaText}
              onSave={(v) => onUpdate({ ctaText: v })}
              placeholder="оставить заявку"
            >
              <span className="h3 text-[#0A0A0A]">
                {ctaText || "оставить заявку"}
              </span>
            </InlineEdit>
          </div>
        </div>
      </div>
    </div>
  );
}
