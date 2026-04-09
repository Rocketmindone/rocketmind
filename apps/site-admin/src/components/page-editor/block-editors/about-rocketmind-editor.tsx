"use client";

import { Switch } from "@rocketmind/ui";
import { InlineEdit } from "@/components/inline-edit";

interface AboutRocketmindEditorProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

const DEFAULTS = {
  heading: "От идеи\nдо бизнес-модели",
  founderName: "Алексей Еремин",
  founderBio: "Мы не просто консультируем, мы строим работающие сетевые структуры",
  founderRole: "Основатель Rocketmind, эксперт по экосистемной архитектуре и стратег цифровой трансформации.",
  features: [
    { title: "Доступ к ИИ-агентам", text: "Встроенные интеллектуальные ассистенты, которые усиливают командную работу. Работают внутри каждого продукта Rocketmind." },
    { title: "Более 20 лет в IT", text: "Мы создавали онлайн-продукты, сервисы и платформы, выступали с лекциями для научного и бизнес-сообщества в России и за рубежом." },
    { title: "Экспертная команда", text: "Над исследованиями работают аналитики и маркетологи, команда редакторов делает материалы простыми для восприятия." },
  ],
};

export function AboutRocketmindEditor({ data, onUpdate }: AboutRocketmindEditorProps) {
  const heading = (data.heading as string) || DEFAULTS.heading;
  const founderName = (data.founderName as string) || DEFAULTS.founderName;
  const founderBio = (data.founderBio as string) || DEFAULTS.founderBio;
  const founderRole = (data.founderRole as string) || DEFAULTS.founderRole;
  const features = (data.features as Array<{ title: string; text: string }>) || DEFAULTS.features;
  const variant = (data.variant as string) || "dark";
  const isDark = variant === "dark";

  function updateFeature(index: number, field: string, value: string) {
    const updated = features.map((f, i) =>
      i === index ? { ...f, [field]: value } : f
    );
    onUpdate({ features: updated });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Note about global text */}
      <div className="rounded border border-[#FFCC00]/30 bg-[#FFCC00]/5 px-4 py-3 text-[13px] leading-relaxed text-foreground/80">
        <strong className="text-[#FFCC00]">⚠ Общий текст:</strong> изменения текстовых полей в этом блоке
        применяются <strong>ко всем страницам</strong>. Переключатель вида влияет только на текущую страницу.
      </div>

      {/* Variant switch */}
      <div className="flex items-center gap-3">
        <Switch
          checked={isDark}
          onCheckedChange={(v) => onUpdate({ variant: v ? "dark" : "light" })}
          size="sm"
        />
        <span className="text-sm text-muted-foreground">
          {isDark ? "Тёмный фон" : "Светлый фон"}
        </span>
      </div>

      {/* Heading */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Заголовок</span>
        <InlineEdit value={heading} onSave={(v) => onUpdate({ heading: v })} placeholder="Заголовок" multiline>
          <h2 className="h3 text-[#F0F0F0] whitespace-pre-line">{heading}</h2>
        </InlineEdit>
      </div>

      {/* Founder */}
      <div className="flex flex-col gap-3 rounded border border-[#404040] p-4">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Основатель</span>

        <InlineEdit value={founderName} onSave={(v) => onUpdate({ founderName: v })} placeholder="Имя">
          <span className="h4 text-[#F0F0F0]">{founderName}</span>
        </InlineEdit>

        <InlineEdit value={founderBio} onSave={(v) => onUpdate({ founderBio: v })} placeholder="Подпись" multiline>
          <p className="text-sm text-[#F0F0F0]">{founderBio}</p>
        </InlineEdit>

        <InlineEdit value={founderRole} onSave={(v) => onUpdate({ founderRole: v })} placeholder="Роль" multiline>
          <p className="text-sm text-[#939393]">{founderRole}</p>
        </InlineEdit>
      </div>

      {/* Features */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Преимущества</span>
        {features.map((f, i) => (
          <div key={i} className="flex flex-col gap-2 rounded border border-[#404040] p-4">
            <InlineEdit value={f.title} onSave={(v) => updateFeature(i, "title", v)} placeholder="Заголовок">
              <h4 className="h4 text-[#F0F0F0]">{f.title}</h4>
            </InlineEdit>
            <InlineEdit value={f.text} onSave={(v) => updateFeature(i, "text", v)} placeholder="Описание" multiline>
              <p className="text-sm text-[#939393]">{f.text}</p>
            </InlineEdit>
            {i === 0 && (
              <div className="mt-2 rounded bg-[#121212] px-3 py-2 text-xs text-[#939393]">
                ↑ Этот блок содержит карусель AI-агентов
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
