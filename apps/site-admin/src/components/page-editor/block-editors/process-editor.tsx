"use client";

import { Plus, Trash2 } from "lucide-react";
import { InlineEdit } from "@/components/inline-edit";

interface ProcessEditorProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

export function ProcessEditor({ data, onUpdate }: ProcessEditorProps) {
  const tag = (data.tag as string) || "";
  const title = (data.title as string) || "";
  const subtitle = (data.subtitle as string) || "";
  const description = (data.description as string) || "";
  const steps =
    (data.steps as Array<{
      number: string;
      title: string;
      text: string;
      duration: string;
    }>) || [];
  const participantsTag = (data.participantsTag as string) || "";
  const participants =
    (data.participants as Array<{ role: string; text: string }>) || [];

  function updateStep(index: number, field: string, value: string) {
    const updated = steps.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    );
    onUpdate({ steps: updated });
  }

  function addStep() {
    onUpdate({
      steps: [
        ...steps,
        {
          number: String(steps.length + 1).padStart(2, "0"),
          title: "",
          text: "",
          duration: "",
        },
      ],
    });
  }

  function removeStep(index: number) {
    onUpdate({ steps: steps.filter((_, i) => i !== index) });
  }

  function updateParticipant(index: number, field: string, value: string) {
    const updated = participants.map((p, i) =>
      i === index ? { ...p, [field]: value } : p
    );
    onUpdate({ participants: updated });
  }

  function addParticipant() {
    onUpdate({ participants: [...participants, { role: "", text: "" }] });
  }

  function removeParticipant(index: number) {
    onUpdate({ participants: participants.filter((_, i) => i !== index) });
  }

  return (
    <div className="overflow-hidden rounded-sm border-t border-[#404040] bg-[#0A0A0A]">
      <div className="flex flex-col gap-8 px-8 py-10 lg:flex-row lg:gap-16">
        {/* Left: header + participants */}
        <div className="flex flex-col gap-6 lg:w-1/2">
          <InlineEdit
            value={tag}
            onSave={(v) => onUpdate({ tag: v })}
            placeholder="этапы"
          >
            <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] uppercase text-[#FFCC00]">
              {tag || "тег"}
            </span>
          </InlineEdit>

          <InlineEdit
            value={title}
            onSave={(v) => onUpdate({ title: v })}
            placeholder="Заголовок"
          >
            <h2 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase tracking-tight text-[#F0F0F0] lg:text-[length:var(--text-32)]">
              {title || "Заголовок"}
            </h2>
          </InlineEdit>

          <InlineEdit
            value={subtitle}
            onSave={(v) => onUpdate({ subtitle: v })}
            placeholder="Общий срок проекта: ~10 недель"
          >
            <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] uppercase text-[#F0F0F0] lg:text-[length:var(--text-18)]">
              {subtitle || "подзаголовок"}
            </span>
          </InlineEdit>

          <InlineEdit
            value={description}
            onSave={(v) => onUpdate({ description: v })}
            multiline
            placeholder="Описание процесса"
          >
            <p className="text-[length:var(--text-16)] text-[#939393]">
              {description || "Описание"}
            </p>
          </InlineEdit>

          {/* Participants block */}
          {(participants.length > 0 || participantsTag) && (
            <div className="mt-4 rounded-sm bg-[#121212] p-6">
              <InlineEdit
                value={participantsTag}
                onSave={(v) => onUpdate({ participantsTag: v })}
                placeholder="кого важно включить"
              >
                <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase text-[#FFCC00]">
                  {participantsTag || "участники"}
                </span>
              </InlineEdit>

              <div className="mt-4 flex flex-col gap-4">
                {participants.map((p, index) => (
                  <div
                    key={index}
                    className="group/part relative flex flex-col gap-1"
                  >
                    <button
                      onClick={() => removeParticipant(index)}
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-sm text-[#939393] opacity-0 transition-opacity hover:text-[#ED4843] group-hover/part:opacity-100"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>

                    <InlineEdit
                      value={p.role}
                      onSave={(v) => updateParticipant(index, "role", v)}
                      placeholder="Роль"
                    >
                      <span className="text-[length:var(--text-16)] font-semibold text-[#F0F0F0]">
                        {p.role || "Роль"}
                      </span>
                    </InlineEdit>

                    <InlineEdit
                      value={p.text}
                      onSave={(v) => updateParticipant(index, "text", v)}
                      placeholder="Описание"
                    >
                      <span className="text-[length:var(--text-14)] text-[#939393]">
                        {p.text || "Описание"}
                      </span>
                    </InlineEdit>
                  </div>
                ))}

                <button
                  onClick={addParticipant}
                  className="flex items-center justify-center gap-1 border border-dashed border-[#404040] py-3 text-[length:var(--text-12)] text-[#939393] transition-colors hover:border-[#FFCC00] hover:text-[#FFCC00]"
                >
                  <Plus className="h-3 w-3" />
                  Добавить участника
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: timeline steps */}
        <div className="flex flex-1 flex-col">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group/step relative flex gap-4 border-l-2 border-[#404040] py-6 pl-6"
            >
              {/* Timeline dot */}
              <div className="absolute -left-[5px] top-7 h-2 w-2 bg-[#FFCC00]" />

              <button
                onClick={() => removeStep(index)}
                className="absolute right-0 top-4 flex h-5 w-5 items-center justify-center rounded-sm text-[#939393] opacity-0 transition-opacity hover:text-[#ED4843] group-hover/step:opacity-100"
              >
                <Trash2 className="h-3 w-3" />
              </button>

              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-baseline gap-3">
                  <InlineEdit
                    value={step.number}
                    onSave={(v) => updateStep(index, "number", v)}
                    placeholder="01"
                  >
                    <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] uppercase text-[#F0F0F0]">
                      {step.number || "—"}
                    </span>
                  </InlineEdit>

                  <InlineEdit
                    value={step.duration}
                    onSave={(v) => updateStep(index, "duration", v)}
                    placeholder="2 недели"
                  >
                    <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase text-[#FFCC00]">
                      {step.duration || "срок"}
                    </span>
                  </InlineEdit>
                </div>

                <InlineEdit
                  value={step.title}
                  onSave={(v) => updateStep(index, "title", v)}
                  placeholder="Название этапа"
                >
                  <span className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-18)] font-bold uppercase tracking-tight text-[#F0F0F0] lg:text-[length:var(--text-24)]">
                    {step.title || "Этап"}
                  </span>
                </InlineEdit>

                <InlineEdit
                  value={step.text}
                  onSave={(v) => updateStep(index, "text", v)}
                  multiline
                  placeholder="Описание этапа"
                >
                  <p className="text-[length:var(--text-14)] text-[#939393] lg:text-[length:var(--text-16)]">
                    {step.text || "Описание"}
                  </p>
                </InlineEdit>
              </div>
            </div>
          ))}

          {/* Add step */}
          <button
            onClick={addStep}
            className="flex items-center justify-center gap-1 border border-dashed border-[#404040] py-6 text-[length:var(--text-14)] text-[#939393] transition-colors hover:border-[#FFCC00] hover:text-[#FFCC00]"
          >
            <Plus className="h-3.5 w-3.5" />
            Добавить этап
          </button>
        </div>
      </div>
    </div>
  );
}
