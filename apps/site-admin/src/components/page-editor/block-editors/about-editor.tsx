"use client";

import { useState, useRef } from "react";
import { Plus, GripVertical, ImagePlus, X as XIcon } from "lucide-react";
import { Switch } from "@rocketmind/ui";
import { InlineEdit } from "@/components/inline-edit";
import { InlineConfirmDelete } from "@/components/inline-confirm";
import { useItemDnd } from "@/lib/use-item-dnd";

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
  const collapsible = data.accordionCollapsible !== false;
  const hasImage = data.hasImage === true;
  const aboutImageData = (data.aboutImageData as string) || "";

  const [closedIndices, setClosedIndices] = useState<Set<number>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dnd = useItemDnd(accordion, (reordered) =>
    onUpdate({ accordion: reordered })
  );

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
    setClosedIndices((prev) => {
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
  }

  function toggleAccordion(index: number) {
    if (!collapsible) return;
    setClosedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onUpdate({ aboutImageData: reader.result as string });
    };
    reader.readAsDataURL(file);
  }

  function removeImage() {
    onUpdate({ aboutImageData: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // ── Accordion items renderer ──────────────────────────────────────────────

  function renderAccordion() {
    return (
      <div className="flex flex-col">
        {accordion.map((item, index) => {
          const isOpen = collapsible ? !closedIndices.has(index) : true;
          const isFirst = index === 0;
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
              className={`group/acc relative transition-all ${
                isDragging ? "opacity-60" : ""
              }`}
            >
              {/* Controls */}
              <div className="absolute -right-1 -top-1 z-10 flex items-center gap-0.5 opacity-0 transition-opacity group-hover/acc:opacity-100">
                <div
                  className="flex h-5 w-5 cursor-grab items-center justify-center rounded-sm bg-[#F0F0F0] text-[#0A0A0A] select-none active:cursor-grabbing"
                  onMouseDown={() => dnd.onGripDown(index)}
                  onMouseUp={dnd.onGripUp}
                >
                  <GripVertical className="h-2.5 w-2.5" />
                </div>
                <InlineConfirmDelete
                  onConfirm={() => removeAccordion(index)}
                  className="bg-[#F0F0F0] text-[#0A0A0A] hover:bg-[#ED4843] hover:text-[#F0F0F0]"
                />
              </div>

              {collapsible ? (
                <button
                  type="button"
                  className={`flex w-full items-start gap-7 py-6 pr-4 text-left border-[#404040] ${
                    isFirst ? "border-t border-b" : "border-b"
                  }`}
                  onClick={() => toggleAccordion(index)}
                >
                  <div className="flex min-w-0 flex-1 flex-col">
                    <InlineEdit
                      value={item.title}
                      onSave={(v) => updateAccordion(index, "title", v)}
                      placeholder="Заголовок пункта"
                    >
                      <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#F0F0F0]">
                        {item.title || "Пункт аккордеона"}
                      </span>
                    </InlineEdit>
                    <div
                      className="grid transition-[grid-template-rows] duration-200 ease-out"
                      style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <div className="pt-4">
                          <InlineEdit
                            value={item.description}
                            onSave={(v) => updateAccordion(index, "description", v)}
                            multiline
                            placeholder="Описание пункта"
                          >
                            <p className="text-[length:var(--text-14)] leading-[1.32] tracking-[0.01em] text-[#939393]">
                              {item.description || "Описание"}
                            </p>
                          </InlineEdit>
                        </div>
                      </div>
                    </div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0 text-[#F0F0F0]">
                    <path d="M1 8H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M8 1V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                      className="origin-center transition-transform duration-200 ease-out"
                      style={{ transform: isOpen ? "scaleY(0)" : "scaleY(1)" }}
                    />
                  </svg>
                </button>
              ) : (
                <div
                  className={`flex w-full flex-col gap-4 py-6 pr-4 border-[#404040] ${
                    isFirst ? "border-t border-b" : "border-b"
                  }`}
                >
                  <InlineEdit
                    value={item.title}
                    onSave={(v) => updateAccordion(index, "title", v)}
                    placeholder="Заголовок пункта"
                  >
                    <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#F0F0F0]">
                      {item.title || "Пункт аккордеона"}
                    </span>
                  </InlineEdit>
                  <InlineEdit
                    value={item.description}
                    onSave={(v) => updateAccordion(index, "description", v)}
                    multiline
                    placeholder="Описание пункта"
                  >
                    <p className="text-[length:var(--text-14)] leading-[1.32] tracking-[0.01em] text-[#939393]">
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
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="rounded-sm border-t border-[#404040] bg-[#0A0A0A] pb-20">
      {/* Block settings */}
      <div className="mx-auto flex max-w-[1512px] items-center gap-6 px-5 pt-6 md:px-8 xl:px-14">
        <label className="flex items-center gap-2 text-[length:var(--text-12)] text-[#939393]">
          <Switch
            checked={collapsible}
            onCheckedChange={(v) => onUpdate({ accordionCollapsible: v })}
            size="sm"
          />
          Сворачиваемый аккордеон
        </label>
        <label className="flex items-center gap-2 text-[length:var(--text-12)] text-[#939393]">
          <Switch
            checked={hasImage}
            onCheckedChange={(v) => onUpdate({ hasImage: v })}
            size="sm"
          />
          С картинкой
        </label>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />

      {hasImage ? (
        /* ── With image variant ── */
        <div className="mx-auto flex max-w-[1512px] flex-col px-5 py-10 md:px-8 lg:flex-row xl:px-14">
          {/* Left: text + accordion — 50%, same as without-image variant */}
          <div className="flex flex-col gap-4 lg:w-1/2 lg:shrink-0 lg:pr-8">
            <div className="flex max-w-[560px] flex-col gap-4">
              <InlineEdit
                value={caption}
                onSave={(v) => onUpdate({ caption: v })}
                placeholder="О продукте"
              >
                <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
                  {caption || "caption"}
                </span>
              </InlineEdit>

              <InlineEdit
                value={title}
                onSave={(v) => onUpdate({ title: v })}
                placeholder="Заголовок"
              >
                <h2 className="h2 text-[#F0F0F0]">
                  {title || "Заголовок блока"}
                </h2>
              </InlineEdit>

              <InlineEdit
                value={description}
                onSave={(v) => onUpdate({ description: v })}
                multiline
                copy
                placeholder="Описание продукта..."
              >
                <p className="text-[length:var(--text-18)] leading-[1.2] text-[#939393]">
                  {description || "Описание"}
                </p>
              </InlineEdit>
            </div>

            {/* Accordion */}
            {renderAccordion()}
          </div>

          {/* Right: image area — 50%, square */}
          <div className="relative mt-8 flex items-center justify-center bg-[#121212] lg:mt-0 lg:w-1/2 lg:aspect-square">
            {aboutImageData ? (
              <>
                <img
                  src={aboutImageData}
                  alt="About"
                  className="h-full w-full object-cover"
                />
                <button
                  onClick={removeImage}
                  className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-sm bg-[#0A0A0A]/80 text-[#F0F0F0] transition-colors hover:bg-[#ED4843]"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center gap-2 text-[#939393] transition-colors hover:text-[#FFCC00]"
              >
                <ImagePlus className="h-10 w-10" />
                <span className="text-[length:var(--text-14)]">Добавить изображение</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* ── Without image variant — 50/50 ── */
        <div className="mx-auto flex max-w-[1512px] flex-col gap-8 px-5 py-10 md:px-8 lg:flex-row xl:px-14">
          {/* Left: text — 50% */}
          <div className="flex flex-col gap-4 lg:w-1/2 lg:shrink-0 lg:pr-8">
            <div className="flex max-w-[560px] flex-col gap-4">
              <InlineEdit
                value={caption}
                onSave={(v) => onUpdate({ caption: v })}
                placeholder="О продукте"
              >
                <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
                  {caption || "caption"}
                </span>
              </InlineEdit>

              <InlineEdit
                value={title}
                onSave={(v) => onUpdate({ title: v })}
                placeholder="Заголовок"
              >
                <h2 className="h2 text-[#F0F0F0]">
                  {title || "Заголовок блока"}
                </h2>
              </InlineEdit>

              <InlineEdit
                value={description}
                onSave={(v) => onUpdate({ description: v })}
                multiline
                copy
                placeholder="Описание продукта..."
              >
                <p className="text-[length:var(--text-18)] leading-[1.2] text-[#939393]">
                  {description || "Описание"}
                </p>
              </InlineEdit>
            </div>
          </div>

          {/* Right: accordion — 50% */}
          <div className="lg:w-1/2">
            {renderAccordion()}
          </div>
        </div>
      )}
    </div>
  );
}
