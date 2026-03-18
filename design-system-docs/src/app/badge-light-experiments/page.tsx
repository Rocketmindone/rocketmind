import { Fragment, type CSSProperties } from "react"
import { Badge } from "@/components/ui/badge"

const badgeColors = [
  { key: "yellow", label: "Yellow", variant: "yellow-subtle" },
  { key: "violet", label: "Violet", variant: "violet-subtle" },
  { key: "sky", label: "Sky", variant: "sky-subtle" },
  { key: "terracotta", label: "Terracotta", variant: "terracotta-subtle" },
  { key: "pink", label: "Pink", variant: "pink-subtle" },
  { key: "blue", label: "Blue", variant: "blue-subtle" },
  { key: "red", label: "Red", variant: "red-subtle" },
  { key: "green", label: "Green", variant: "green-subtle" },
] as const

const preservedContrastColors = new Set(["violet", "blue"])
const extraBoostColors = new Set(["yellow", "green"])

function ExperimentalBadge({
  color,
  label,
  mode,
}: {
  color: (typeof badgeColors)[number]["key"]
  label: string
  mode: "current" | "border-500" | "bg-700" | "bg-500" | "bg-300" | "bg-900-plus-30"
}) {
  const styleMap: Record<typeof mode, CSSProperties> = {
    current: {
      backgroundColor: `var(--rm-${color}-900)`,
      color: `var(--rm-${color}-fg-subtle)`,
      borderColor: "transparent",
    },
    "border-500": {
      backgroundColor: `var(--rm-${color}-900)`,
      color: `var(--rm-${color}-fg-subtle)`,
      borderColor: `var(--rm-${color}-500)`,
    },
    "bg-700": {
      backgroundColor: `var(--rm-${color}-700)`,
      color: `var(--rm-${color}-fg-subtle)`,
      borderColor: "transparent",
    },
    "bg-500": {
      backgroundColor: `var(--rm-${color}-500)`,
      color: `var(--rm-${color}-fg-subtle)`,
      borderColor: "transparent",
    },
    "bg-300": {
      backgroundColor: `var(--rm-${color}-300)`,
      color: `var(--rm-${color}-fg-subtle)`,
      borderColor: "transparent",
    },
    "bg-900-plus-30": {
      backgroundColor: preservedContrastColors.has(color)
        ? `color-mix(in srgb, var(--rm-${color}-700) 30%, var(--rm-${color}-900) 70%)`
        : extraBoostColors.has(color)
          ? `color-mix(in srgb, var(--rm-${color}-700) 65.7%, var(--rm-${color}-900) 34.3%)`
          : `color-mix(in srgb, var(--rm-${color}-700) 51%, var(--rm-${color}-900) 49%)`,
      color: `var(--rm-${color}-fg-subtle)`,
      borderColor: "transparent",
    },
  }

  return (
    <span
      className="inline-flex h-6 items-center rounded-sm border px-2 whitespace-nowrap font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.04em]"
      style={styleMap[mode]}
    >
      {label}
    </span>
  )
}

export default function BadgeLightExperimentsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 md:px-10">
        <div className="flex flex-col gap-3">
          <p className="w-fit rounded-sm border border-border bg-[var(--rm-gray-1)] px-2 py-1 font-[family-name:var(--font-mono-family)] text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
            Badge Light Theme Experiments
          </p>
          <div className="flex flex-col gap-2">
            <h1 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-40)] uppercase tracking-[-0.02em]">
              Цветные бейджи на светлой теме
            </h1>
            <p className="max-w-4xl text-[length:var(--text-16)] text-muted-foreground">
              Отдельная тестовая страница без изменений дизайн-системы. Ниже показаны текущий subtle-стиль и четыре экспериментальных варианта:
              обводка `500`, фон `700`, фон `500`, фон `300`.
            </p>
          </div>
        </div>

        <section className="rounded-lg border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <h2 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] uppercase">
              Сетка сравнения
            </h2>
          </div>

          <div className="overflow-x-auto">
            <div
              className="grid min-w-[1140px]"
              style={{ gridTemplateColumns: "140px repeat(5, minmax(180px, 1fr))" }}
            >
              <div className="border-r border-b border-border bg-[var(--rm-gray-1)] px-4 py-3 font-[family-name:var(--font-mono-family)] text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                Цвет
              </div>
              <div className="border-r border-b border-border bg-[var(--rm-gray-1)] px-4 py-3 font-[family-name:var(--font-mono-family)] text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                Current subtle
              </div>
              <div className="border-r border-b border-border bg-[var(--rm-gray-1)] px-4 py-3 font-[family-name:var(--font-mono-family)] text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                1. Border 500
              </div>
              <div className="border-r border-b border-border bg-[var(--rm-gray-1)] px-4 py-3 font-[family-name:var(--font-mono-family)] text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                2. BG 700
              </div>
              <div className="border-r border-b border-border bg-[var(--rm-gray-1)] px-4 py-3 font-[family-name:var(--font-mono-family)] text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                3. BG 500
              </div>
              <div className="border-b border-border bg-[var(--rm-gray-1)] px-4 py-3 font-[family-name:var(--font-mono-family)] text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                4. BG 300
              </div>

              {badgeColors.map((color, index) => (
                <Fragment key={color.key}>
                  <div
                    className={`border-r px-4 py-4 ${index < badgeColors.length - 1 ? "border-b" : ""} border-border`}
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-16)] uppercase">
                        {color.label}
                      </span>
                      <span className="font-[family-name:var(--font-mono-family)] text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                        {color.variant}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`border-r px-4 py-4 ${index < badgeColors.length - 1 ? "border-b" : ""} border-border`}
                  >
                    <div className="flex min-h-14 items-center">
                      <Badge variant={color.variant}>Статус</Badge>
                    </div>
                  </div>
                  <div
                    className={`border-r px-4 py-4 ${index < badgeColors.length - 1 ? "border-b" : ""} border-border`}
                  >
                    <div className="flex min-h-14 items-center">
                      <ExperimentalBadge color={color.key} mode="border-500" label="Статус" />
                    </div>
                  </div>
                  <div
                    className={`border-r px-4 py-4 ${index < badgeColors.length - 1 ? "border-b" : ""} border-border`}
                  >
                    <div className="flex min-h-14 items-center">
                      <ExperimentalBadge color={color.key} mode="bg-700" label="Статус" />
                    </div>
                  </div>
                  <div
                    className={`border-r px-4 py-4 ${index < badgeColors.length - 1 ? "border-b" : ""} border-border`}
                  >
                    <div className="flex min-h-14 items-center">
                      <ExperimentalBadge color={color.key} mode="bg-500" label="Статус" />
                    </div>
                  </div>
                  <div
                    className={`px-4 py-4 ${index < badgeColors.length - 1 ? "border-b" : ""} border-border`}
                  >
                    <div className="flex min-h-14 items-center">
                      <ExperimentalBadge color={color.key} mode="bg-300" label="Статус" />
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-18)] uppercase">
              1. Border 500
            </h3>
            <p className="mt-2 text-[length:var(--text-14)] text-muted-foreground">
              Сохраняет текущую мягкость фона `900`, но добавляет отделение от страницы через цветную обводку.
            </p>
          </article>

          <article className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-18)] uppercase">
              2. BG 700
            </h3>
            <p className="mt-2 text-[length:var(--text-14)] text-muted-foreground">
              Делает фон заметно плотнее, не добавляя дополнительных декоративных элементов.
            </p>
          </article>

          <article className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-18)] uppercase">
              3. BG 500
            </h3>
            <p className="mt-2 text-[length:var(--text-14)] text-muted-foreground">
              Компромиссный вариант между `700` и `300`: фон заметнее текущего, но мягче, чем самый насыщенный сценарий.
            </p>
          </article>

          <article className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-18)] uppercase">
              4. BG 300
            </h3>
            <p className="mt-2 text-[length:var(--text-14)] text-muted-foreground">
              Самый заметный вариант. Удобен для проверки, насколько насыщение можно поднять без потери читаемости.
            </p>
          </article>
        </section>

        <section className="rounded-lg border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <h2 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] uppercase">
              900 + 30% к 700
            </h2>
            <p className="mt-2 max-w-4xl text-[length:var(--text-14)] text-muted-foreground">
              Отдельный вариант: базово фон вычислен как 30% пути от `900` к `700`, через `color-mix`. Для `Violet` и `Blue`
              он оставлен без изменений, для большинства остальных цветов усилен ещё на 30%, а для `Yellow` и `Green` добавлен
              ещё один дополнительный шаг на 30%, потому что им по-прежнему не хватало отделения от светлого фона.
            </p>
          </div>

          <div className="grid gap-px bg-border md:grid-cols-2">
            <div className="bg-background p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-18)] uppercase">
                  На фоне страницы
                </h3>
                <code className="rounded-sm bg-[var(--rm-gray-1)] px-1.5 py-1 font-[family-name:var(--font-caption-family)] text-[11px] text-muted-foreground">
                  var(--background)
                </code>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {badgeColors.map((color) => (
                  <div key={`page-bg-${color.key}`} className="flex min-h-16 items-center rounded-lg border border-border bg-background px-4">
                    <ExperimentalBadge color={color.key} mode="bg-900-plus-30" label={color.label} />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-18)] uppercase">
                  На белом фоне
                </h3>
                <code className="rounded-sm bg-[var(--rm-gray-1)] px-1.5 py-1 font-[family-name:var(--font-caption-family)] text-[11px] text-muted-foreground">
                  #FFFFFF
                </code>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {badgeColors.map((color) => (
                  <div key={`white-bg-${color.key}`} className="flex min-h-16 items-center rounded-lg border border-[var(--rm-gray-3)] bg-white px-4">
                    <ExperimentalBadge color={color.key} mode="bg-900-plus-30" label={color.label} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
