"use client"

import * as React from "react"
import { BellRing, LayoutGrid, LayoutList, Moon, ShieldCheck, Sun } from "lucide-react"

import { CopyButton } from "@/components/copy-button"
import { SpecBlock } from "@/components/ds/shared"
import { Badge, Switch, Tabs, TabsList, TabsTrigger } from "@rocketmind/ui"

const BOOLEAN_IMPORT = `import { Switch } from "@rocketmind/ui"`
const TEXT_IMPORT = `import { Tabs, TabsList, TabsTrigger } from "@rocketmind/ui"`

function SwitchRow({
  icon,
  label,
  control,
  quiet = false,
}: {
  icon?: React.ReactNode
  label: string
  control: React.ReactNode
  quiet?: boolean
}) {
  return (
    <label className={`flex items-center justify-between gap-4 rounded-lg border border-border p-4 ${quiet ? "bg-rm-gray-1" : "bg-background"}`}>
      <span className="flex min-w-0 items-center gap-3">
        {icon ? (
          <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-sm border border-border bg-rm-gray-1 text-muted-foreground">
            {icon}
          </span>
        ) : null}
        <span className="text-[length:var(--text-14)] text-foreground">{label}</span>
      </span>
      <span className="shrink-0">{control}</span>
    </label>
  )
}

function SizeLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em] text-muted-foreground">
      {children}
    </p>
  )
}

export function SwitchShowcase() {
  const [autoPayEnabled, setAutoPayEnabled] = React.useState(true)

  return (
    <div className="space-y-8">

      {/* ═══ 1. BOOLEAN SWITCH ═══ */}
      <div className="rounded-lg border border-border p-6 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Badge variant="outline" className="text-[length:var(--text-12)]">BOOLEAN SWITCH</Badge>
            <p className="mt-2 text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-caption-family)]">
              Тумблер для on/off. Squircle-форма (rounded-sm). Два размера.
            </p>
          </div>
          <CopyButton value={BOOLEAN_IMPORT} label="Switch import" />
        </div>

        {/* Sizes */}
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="grid gap-px bg-border grid-cols-[1fr_1fr]">
            <div className="bg-muted/60 px-4 py-2">
              <SizeLabel>Default / 36×20</SizeLabel>
            </div>
            <div className="bg-muted/60 px-4 py-2">
              <SizeLabel>SM / 28×16</SizeLabel>
            </div>
            <div className="bg-background px-4 py-4 flex items-center gap-4">
              <Switch aria-label="Default checked" defaultChecked />
              <Switch aria-label="Default unchecked" />
            </div>
            <div className="bg-background px-4 py-4 flex items-center gap-4">
              <Switch aria-label="SM checked" size="sm" defaultChecked />
              <Switch aria-label="SM unchecked" size="sm" />
            </div>
          </div>
        </div>

        {/* States */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <SizeLabel>Default</SizeLabel>
            <SwitchRow
              label="Автооплата"
              control={<Switch aria-label="Автооплата" checked={autoPayEnabled} onCheckedChange={setAutoPayEnabled} />}
            />
            <SwitchRow
              icon={<ShieldCheck size={16} strokeWidth={2.4} />}
              label="Подтверждение кейса"
              control={<Switch aria-label="Подтверждение кейса" defaultChecked />}
              quiet
            />
          </div>
          <div className="space-y-3">
            <SizeLabel>Disabled</SizeLabel>
            <SwitchRow
              label="Уведомления"
              control={<Switch aria-label="Уведомления" checked disabled readOnly />}
            />
            <SwitchRow
              label="Синхронизация CRM"
              control={<Switch aria-label="Синхронизация CRM" disabled />}
              quiet
            />
          </div>
        </div>
      </div>

      {/* ═══ 2. TEXT SWITCH ═══ */}
      <div className="rounded-lg border border-border p-6 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Badge variant="outline" className="text-[length:var(--text-12)]">TEXT SWITCH</Badge>
            <p className="mt-2 text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-caption-family)]">
              Сегментированный переключатель из двух пунктов. Композиция из Tabs с двумя TabsTrigger.
            </p>
          </div>
          <CopyButton value={TEXT_IMPORT} label="Tabs import" />
        </div>

        {/* Sizes grid */}
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="grid gap-px bg-border grid-cols-[1fr_1fr]">
            <div className="bg-muted/60 px-4 py-2">
              <SizeLabel>Default / 40px</SizeLabel>
            </div>
            <div className="bg-muted/60 px-4 py-2">
              <SizeLabel>SM / 32px</SizeLabel>
            </div>
            <div className="bg-background px-4 py-4 flex items-center justify-center">
              <Tabs defaultValue="yearly">
                <TabsList>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="yearly">Yearly</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="bg-background px-4 py-4 flex items-center justify-center">
              <Tabs defaultValue="yearly">
                <TabsList size="sm">
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="yearly">Yearly</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Examples */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <SizeLabel>Default — формы и настройки</SizeLabel>
            <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background p-4">
              <span className="text-[length:var(--text-14)] text-foreground">Период оплаты</span>
              <Tabs defaultValue="yearly">
                <TabsList>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="yearly">Yearly</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-rm-gray-1 p-4">
              <span className="text-[length:var(--text-14)] text-foreground">Режим просмотра</span>
              <Tabs defaultValue="source">
                <TabsList>
                  <TabsTrigger value="source">Source</TabsTrigger>
                  <TabsTrigger value="output">Output</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          <div className="space-y-3">
            <SizeLabel>SM — toolbar и компактные панели</SizeLabel>
            <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background p-4">
              <span className="text-[length:var(--text-14)] text-foreground">Зум</span>
              <Tabs defaultValue="out">
                <TabsList size="sm">
                  <TabsTrigger value="out">Out</TabsTrigger>
                  <TabsTrigger value="in">In</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-rm-gray-1 p-4">
              <span className="text-[length:var(--text-14)] text-foreground">Фильтр</span>
              <Tabs defaultValue="all">
                <TabsList size="sm">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ 3. ICON SWITCH ═══ */}
      <div className="rounded-lg border border-border p-6 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Badge variant="outline" className="text-[length:var(--text-12)]">ICON SWITCH</Badge>
            <p className="mt-2 text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-caption-family)]">
              Tabs с двумя иконками. Для компактных toolbar-переключателей.
            </p>
          </div>
          <CopyButton value={TEXT_IMPORT} label="Tabs import" />
        </div>

        {/* Sizes grid */}
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="grid gap-px bg-border grid-cols-[1fr_1fr]">
            <div className="bg-muted/60 px-4 py-2">
              <SizeLabel>Default / 40px</SizeLabel>
            </div>
            <div className="bg-muted/60 px-4 py-2">
              <SizeLabel>SM / 32px</SizeLabel>
            </div>
            <div className="bg-background px-4 py-4 flex items-center justify-center">
              <Tabs defaultValue="light">
                <TabsList>
                  <TabsTrigger value="light"><Sun size={16} strokeWidth={2.4} /></TabsTrigger>
                  <TabsTrigger value="dark"><Moon size={16} strokeWidth={2.4} /></TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="bg-background px-4 py-4 flex items-center justify-center">
              <Tabs defaultValue="light">
                <TabsList size="sm">
                  <TabsTrigger value="light"><Sun size={14} strokeWidth={2.4} /></TabsTrigger>
                  <TabsTrigger value="dark"><Moon size={14} strokeWidth={2.4} /></TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Examples */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <SizeLabel>Default</SizeLabel>
            <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background p-4">
              <span className="text-[length:var(--text-14)] text-foreground">Тема</span>
              <Tabs defaultValue="light">
                <TabsList>
                  <TabsTrigger value="light"><Sun size={16} strokeWidth={2.4} /></TabsTrigger>
                  <TabsTrigger value="dark"><Moon size={16} strokeWidth={2.4} /></TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-rm-gray-1 p-4">
              <span className="text-[length:var(--text-14)] text-foreground">Вид каталога</span>
              <Tabs defaultValue="grid">
                <TabsList>
                  <TabsTrigger value="grid"><LayoutGrid size={16} strokeWidth={2.4} /></TabsTrigger>
                  <TabsTrigger value="list"><LayoutList size={16} strokeWidth={2.4} /></TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          <div className="space-y-3">
            <SizeLabel>SM</SizeLabel>
            <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background p-4">
              <span className="text-[length:var(--text-14)] text-foreground">Тема</span>
              <Tabs defaultValue="dark">
                <TabsList size="sm">
                  <TabsTrigger value="light"><Sun size={14} strokeWidth={2.4} /></TabsTrigger>
                  <TabsTrigger value="dark"><Moon size={14} strokeWidth={2.4} /></TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-rm-gray-1 p-4">
              <span className="text-[length:var(--text-14)] text-foreground">Вид каталога</span>
              <Tabs defaultValue="list">
                <TabsList size="sm">
                  <TabsTrigger value="grid"><LayoutGrid size={14} strokeWidth={2.4} /></TabsTrigger>
                  <TabsTrigger value="list"><LayoutList size={14} strokeWidth={2.4} /></TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ 4. TOKENS & RULES ═══ */}
      <SpecBlock title="Токены и размеры">
        <div className="space-y-6">
          <div className="overflow-auto rounded-lg border border-border">
            <table className="w-full text-[length:var(--text-14)]">
              <thead>
                <tr className="border-b border-border bg-rm-gray-2/30">
                  <th className="text-left px-4 py-2 font-medium">Тип</th>
                  <th className="text-left px-4 py-2 font-medium">Размер</th>
                  <th className="text-left px-4 py-2 font-medium">Высота</th>
                  <th className="text-left px-4 py-2 font-medium">Импорт</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {([
                  ["Boolean", "default", "36×20", BOOLEAN_IMPORT],
                  ["Boolean", "sm", "28×16", BOOLEAN_IMPORT],
                  ["Text", "default", "40px (trigger 32px)", TEXT_IMPORT],
                  ["Text", "sm", "32px (trigger 28px)", TEXT_IMPORT],
                  ["Icon", "default", "40px (trigger 32px)", TEXT_IMPORT],
                  ["Icon", "sm", "32px (trigger 28px)", TEXT_IMPORT],
                ] as const).map(([type, size, height, imp]) => (
                  <tr key={`${type}-${size}`} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 font-medium text-foreground">{type}</td>
                    <td className="px-4 py-2"><code className="ds-token-chip">{size}</code></td>
                    <td className="px-4 py-2 font-[family-name:var(--font-caption-family)]">{height}</td>
                    <td className="px-4 py-2"><CopyButton value={imp} label={`${type} ${size} import`} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {[
              "Boolean Switch переключает on/off. Text и Icon Switch переключают режим из двух вариантов.",
              "Text / Icon Switch реализуется через Tabs с двумя TabsTrigger. Отдельного компонента нет.",
              "SM-размер (32px) выравнивается по высоте с Button size=\"icon\". Подходит для toolbar.",
              "Default-размер (40px) используется в формах, настройках и standalone-переключателях.",
            ].map((rule) => (
              <p key={rule} className="text-[length:var(--text-14)] text-muted-foreground">
                {rule}
              </p>
            ))}
          </div>
        </div>
      </SpecBlock>
    </div>
  )
}
