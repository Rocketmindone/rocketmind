"use client"

import * as React from "react"
import { ShowMore, ShowMorePanel, Badge } from "@rocketmind/ui"
import { SpecBlock } from "@/components/ds/shared"

const mono = "font-[family-name:var(--font-mono-family)]"

const ALL_AGENTS = [
  { name: "Аналитик", role: "Финансовый анализ и прогнозирование" },
  { name: "Стратег", role: "Разработка стратегии и планирование" },
  { name: "Исследователь", role: "Маркетинговые исследования рынка" },
  { name: "Тестировщик", role: "Тестирование гипотез и A/B тесты" },
  { name: "Копирайтер", role: "Создание текстов и контента" },
  { name: "Дизайнер", role: "Визуальный дизайн и брендинг" },
  { name: "Разработчик", role: "Прототипирование и MVP-разработка" },
  { name: "Консультант", role: "Бизнес-консалтинг и аудит" },
]

export function ShowMoreShowcase() {
  const [listExpanded, setListExpanded] = React.useState(false)
  const [textExpanded, setTextExpanded] = React.useState(false)
  const [inlineExpanded, setInlineExpanded] = React.useState(false)

  return (
    <div className="space-y-8">

      {/* ── States grid ── */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="grid gap-px bg-border md:grid-cols-[160px_1fr_1fr]">
          <div className="bg-muted/60 px-4 py-3" />
          {["Collapsed", "Expanded"].map((state) => (
            <div key={state} className="bg-muted/60 px-4 py-3">
              <p className={`text-[length:var(--text-12)] text-muted-foreground ${mono} uppercase tracking-wider`}>
                {state}
              </p>
            </div>
          ))}

          <div className="bg-background px-4 py-4 flex items-center">
            <p className="text-[length:var(--text-14)] font-medium text-foreground">Default</p>
          </div>
          <div className="bg-background px-4 py-4">
            <ShowMore expanded={false} onClick={() => {}} />
          </div>
          <div className="bg-background px-4 py-4">
            <ShowMore expanded={true} onClick={() => {}} />
          </div>

          <div className="bg-background px-4 py-4 flex items-center">
            <p className="text-[length:var(--text-14)] font-medium text-foreground">Custom label</p>
          </div>
          <div className="bg-background px-4 py-4">
            <ShowMore expanded={false} onClick={() => {}} label="Ещё агенты" labelExpanded="Скрыть агентов" />
          </div>
          <div className="bg-background px-4 py-4">
            <ShowMore expanded={true} onClick={() => {}} label="Ещё агенты" labelExpanded="Скрыть агентов" />
          </div>
        </div>
      </div>

      {/* ── Live demos ── */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Demo 1: List */}
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="px-4 py-2 bg-[var(--rm-gray-1)] border-b border-border flex items-center justify-between">
            <p className={`text-[10px] ${mono} uppercase tracking-wider text-muted-foreground`}>Список с раскрытием</p>
            <Badge variant="neutral" size="sm">LIST</Badge>
          </div>
          <div className="p-4 space-y-2">
            {ALL_AGENTS.slice(0, 3).map((agent) => (
              <div key={agent.name} className="flex items-center gap-3 px-3 py-2 rounded-sm hover:bg-[var(--rm-gray-1)] transition-colors">
                <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-sm bg-[var(--rm-gray-2)] text-[length:var(--text-12)] text-muted-foreground">
                  {agent.name[0]}
                </span>
                <div className="min-w-0">
                  <p className="text-[length:var(--text-14)] text-foreground truncate">{agent.name}</p>
                  <p className="text-[length:var(--text-12)] text-muted-foreground truncate">{agent.role}</p>
                </div>
              </div>
            ))}

            <ShowMorePanel expanded={listExpanded} className="space-y-2">
              {ALL_AGENTS.slice(3).map((agent) => (
                <div key={agent.name} className="flex items-center gap-3 px-3 py-2 rounded-sm hover:bg-[var(--rm-gray-1)] transition-colors">
                  <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-sm bg-[var(--rm-gray-2)] text-[length:var(--text-12)] text-muted-foreground">
                    {agent.name[0]}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[length:var(--text-14)] text-foreground truncate">{agent.name}</p>
                    <p className="text-[length:var(--text-12)] text-muted-foreground truncate">{agent.role}</p>
                  </div>
                </div>
              ))}
            </ShowMorePanel>

            <ShowMore
              expanded={listExpanded}
              onClick={() => setListExpanded(!listExpanded)}
              label={`Ещё ${ALL_AGENTS.length - 3} агента`}
              labelExpanded="Скрыть"
            />
          </div>
        </div>

        {/* Demo 2: Text */}
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="px-4 py-2 bg-[var(--rm-gray-1)] border-b border-border flex items-center justify-between">
            <p className={`text-[10px] ${mono} uppercase tracking-wider text-muted-foreground`}>Описание с раскрытием</p>
            <Badge variant="neutral" size="sm">TEXT</Badge>
          </div>
          <div className="p-4 space-y-3">
            <p className="text-[length:var(--text-14)] text-muted-foreground leading-relaxed">
              AI-агент «Стратег» разрабатывает планы роста и анализирует рыночные возможности.
              Специализируется на B2B-стратегиях и конкурентном анализе.
            </p>
            <ShowMorePanel expanded={textExpanded}>
              <p className="text-[length:var(--text-14)] text-muted-foreground leading-relaxed pb-1">
                Агент интегрируется с CRM и аналитическими системами. Формирует еженедельные
                стратегические отчёты, предлагает гипотезы роста и оценивает риски. Работает
                в связке с агентом «Аналитик» для построения финансовых прогнозов.
              </p>
            </ShowMorePanel>
            <ShowMore
              expanded={textExpanded}
              onClick={() => setTextExpanded(!textExpanded)}
            />
          </div>
        </div>

        {/* Demo 3: Settings */}
        <div className="rounded-lg border border-border overflow-hidden lg:col-span-2">
          <div className="px-4 py-2 bg-[var(--rm-gray-1)] border-b border-border flex items-center justify-between">
            <p className={`text-[10px] ${mono} uppercase tracking-wider text-muted-foreground`}>Настройки / доп. опции</p>
            <Badge variant="neutral" size="sm">SETTINGS</Badge>
          </div>
          <div className="p-4 space-y-3">
            {[
              { label: "Имя агента", value: "Стратег" },
              { label: "Модель", value: "claude-sonnet-4-6" },
              { label: "Язык ответа", value: "Русский" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between gap-4 rounded-sm border border-border px-4 py-3 bg-background">
                <span className="text-[length:var(--text-14)] text-foreground">{label}</span>
                <span className={`${mono} text-[length:var(--text-12)] text-muted-foreground uppercase`}>{value}</span>
              </div>
            ))}

            <ShowMore
              expanded={inlineExpanded}
              onClick={() => setInlineExpanded(!inlineExpanded)}
              label="Расширенные настройки"
              labelExpanded="Скрыть настройки"
            />

            <ShowMorePanel expanded={inlineExpanded} className="space-y-3">
              {[
                { label: "Температура", value: "0.7" },
                { label: "Макс. токенов", value: "4096" },
                { label: "Системный промпт", value: "Кастомный" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between gap-4 rounded-sm border border-border px-4 py-3 bg-[var(--rm-gray-1)]">
                  <span className="text-[length:var(--text-14)] text-muted-foreground">{label}</span>
                  <span className={`${mono} text-[length:var(--text-12)] text-muted-foreground uppercase`}>{value}</span>
                </div>
              ))}
            </ShowMorePanel>
          </div>
        </div>
      </div>

      {/* ── Spec ── */}
      <SpecBlock title="Правила">
        <ul className="space-y-1.5 text-[length:var(--text-14)] text-muted-foreground list-disc pl-4">
          <li>Используйте когда контент &gt; 3–5 элементов или текст &gt; 3 строк — обрезайте невидимую часть.</li>
          <li>Кнопка всегда занимает полную ширину контейнера — линия тянется до краёв.</li>
          <li>
            Оборачивайте скрытый контент в <code className="px-1 py-0.5 bg-[var(--rm-gray-2)] rounded-sm text-[length:var(--text-12)]">ShowMorePanel</code>
            {" "}— он плавно анимирует высоту через CSS grid.
          </li>
          <li>
            Передавайте осмысленный <code className="px-1 py-0.5 bg-[var(--rm-gray-2)] rounded-sm text-[length:var(--text-12)]">label</code>
            {" "}— «Ещё 5 агентов» лучше чем «Показать ещё».
          </li>
          <li>Не вкладывайте ShowMore внутрь другого ShowMore — используйте пагинацию.</li>
          <li>
            Анимация панели: <code className="px-1 py-0.5 bg-[var(--rm-gray-2)] rounded-sm text-[length:var(--text-12)]">--duration-smooth</code> (300ms) +{" "}
            <code className="px-1 py-0.5 bg-[var(--rm-gray-2)] rounded-sm text-[length:var(--text-12)]">--ease-standard</code>.
          </li>
        </ul>
      </SpecBlock>
    </div>
  )
}
