"use client";

import { Plus, Trash2 } from "lucide-react";
import { Input, Textarea, Button, Separator } from "@rocketmind/ui";

interface ProcessEditorProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

export function ProcessEditor({ data, onUpdate }: ProcessEditorProps) {
  const tag = (data.tag as string) || "";
  const title = (data.title as string) || "";
  const subtitle = (data.subtitle as string) || "";
  const description = (data.description as string) || "";
  const steps = (data.steps as Array<{ number: string; title: string; text: string; duration: string }>) || [];
  const participantsTag = (data.participantsTag as string) || "";
  const participants = (data.participants as Array<{ role: string; text: string }>) || [];

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
        { number: String(steps.length + 1), title: "", text: "", duration: "" },
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
            placeholder="Процесс"
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
      </div>

      <div className="space-y-1.5">
        <label className="text-[length:var(--text-12)] text-muted-foreground">
          Подзаголовок
        </label>
        <Input
          size="sm"
          value={subtitle}
          onChange={(e) => onUpdate({ subtitle: e.target.value })}
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

      {/* Steps */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[length:var(--text-12)] font-medium text-muted-foreground">
            Этапы
          </label>
          <Button variant="ghost" size="xs" onClick={addStep}>
            <Plus className="mr-1 h-3 w-3" />
            Добавить
          </Button>
        </div>

        {steps.map((step, index) => (
          <div key={index} className="flex items-start gap-2 rounded-sm border border-border p-3">
            <div className="grid flex-1 gap-2 sm:grid-cols-4">
              <Input
                size="sm"
                value={step.number}
                onChange={(e) => updateStep(index, "number", e.target.value)}
                placeholder="01"
              />
              <Input
                size="sm"
                value={step.title}
                onChange={(e) => updateStep(index, "title", e.target.value)}
                placeholder="Название этапа"
              />
              <Input
                size="sm"
                value={step.text}
                onChange={(e) => updateStep(index, "text", e.target.value)}
                placeholder="Описание"
              />
              <Input
                size="sm"
                value={step.duration}
                onChange={(e) => updateStep(index, "duration", e.target.value)}
                placeholder="2 недели"
              />
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => removeStep(index)}
              className="shrink-0 text-muted-foreground hover:text-[var(--rm-red-500)]"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>

      <Separator />

      {/* Participants */}
      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-[length:var(--text-12)] text-muted-foreground">
            Тег участников
          </label>
          <Input
            size="sm"
            value={participantsTag}
            onChange={(e) => onUpdate({ participantsTag: e.target.value })}
            placeholder="Участники"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-[length:var(--text-12)] font-medium text-muted-foreground">
            Участники
          </label>
          <Button variant="ghost" size="xs" onClick={addParticipant}>
            <Plus className="mr-1 h-3 w-3" />
            Добавить
          </Button>
        </div>

        {participants.map((p, index) => (
          <div key={index} className="flex items-start gap-2 rounded-sm border border-border p-3">
            <div className="grid flex-1 gap-2 sm:grid-cols-2">
              <Input
                size="sm"
                value={p.role}
                onChange={(e) => updateParticipant(index, "role", e.target.value)}
                placeholder="Роль"
              />
              <Input
                size="sm"
                value={p.text}
                onChange={(e) => updateParticipant(index, "text", e.target.value)}
                placeholder="Описание"
              />
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => removeParticipant(index)}
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
