"use client"

import React from "react"
import { InfiniteLogoMarquee, Separator } from "@rocketmind/ui"
import type { LogoMarqueeItem } from "@rocketmind/ui"
import { Section, SubSection, SpecBlock } from "@/components/ds/shared"
import { TokenChip } from "@/components/ds/color-helpers"
import { Header } from "@/components/sections/Header"

const BASE_PATH = process.env.NODE_ENV === "production" ? "/rocketmind/ds" : ""

const DEMO_LOGOS: LogoMarqueeItem[] = [
  { alt: "Билайн",          src: `${BASE_PATH}/clip-logos/bilaine.svg`,       width: 125, height: 24 },
  { alt: "ВТБ",             src: `${BASE_PATH}/clip-logos/vtb.svg`,           width: 90,  height: 33 },
  { alt: "Т-Банк",          src: `${BASE_PATH}/clip-logos/tbank.svg`,         width: 116, height: 37 },
  { alt: "Росатом",         src: `${BASE_PATH}/clip-logos/rosatom.svg`,       width: 109, height: 39 },
  { alt: "Минцифры",        src: `${BASE_PATH}/clip-logos/mincifr.svg`,       width: 146, height: 32 },
  { alt: "РУСАЛ",           src: `${BASE_PATH}/clip-logos/ruslan.svg`,        width: 113, height: 34 },
  { alt: "Газпромбанк",     src: `${BASE_PATH}/clip-logos/gazprombank.svg`,   width: 120, height: 36 },
  { alt: "МТС",             src: `${BASE_PATH}/clip-logos/mtc.svg`,           width: 75,  height: 34 },
  { alt: "ВКонтакте",       src: `${BASE_PATH}/clip-logos/vk.svg`,            width: 80,  height: 34 },
  { alt: "X5 Group",        src: `${BASE_PATH}/clip-logos/x5.svg`,            width: 90,  height: 36 },
]

/* ── Nav data for static previews (mirrors site-nav.ts) ── */
const NAV_LABELS_DROPDOWN = ["Консалтинг и стратегии", "Онлайн-школа", "AI-продукты"] as const
const NAV_LABELS_PLAIN = ["О Rocketmind", "Медиа"] as const

export default function CrossBlocksPage() {
  return (
    <>
      <Section id="cross-blocks" title="Сквозные блоки">
        <p className="text-muted-foreground mb-8">
          Блоки, которые появляются на нескольких страницах: лендинг, авторизация, main app.
          Их стиль должен быть абсолютно единым — один компонент, ноль дублирования.
        </p>

        {/* ═══════════════════════════════════════════════════════════════
            1. ФИКСИРОВАННАЯ ШАПКА — Header
           ═══════════════════════════════════════════════════════════════ */}
        <SubSection id="cross-header-fixed" title="Header — Фиксированная шапка" first />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
          Фиксированная шапка для всех страниц кроме главной hero-блока. На главной появляется при
          скролле за середину viewport. Содержит текстовый логотип, <code className="text-foreground">RocketmindMenu</code> (desktop)
          и <code className="text-foreground">MobileNav</code> (mobile).
        </p>

        {/* ── Live preview ── */}
        <div className="rounded-lg border border-border overflow-hidden mb-8 isolate relative z-0">
          <div className="bg-rm-gray-2/20">
            <div className="relative h-16 overflow-hidden">
              <Header />
            </div>
            <div className="px-8 py-10 space-y-3">
              {[100, 75, 88, 60].map((w, i) => (
                <div key={i} className="h-3 rounded-sm bg-rm-gray-2" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
        </div>

        <SpecBlock title="Поведение">
          <div className="space-y-6">
            <div className="overflow-auto rounded-lg border border-border">
              <table className="w-full text-[length:var(--text-14)]">
                <thead>
                  <tr className="border-b border-border bg-rm-gray-2/30">
                    <th className="text-left px-4 py-2 font-medium">Контекст</th>
                    <th className="text-left px-4 py-2 font-medium">Поведение</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  {[
                    ["Главная страница", "Скрыта по умолчанию. Появляется (translate-y + opacity) при скролле за window.innerHeight / 2. fixed top-0, z-50, h-16, bg-background, border-b border-border"],
                    ["Внутренние страницы", "Всегда видна сразу. Тот же стиль: fixed top-0, bg-background, border-b"],
                    ["Десктоп (≥768px)", "Логотип text_logo слева (w-[120px] md:w-[144px]) + RocketmindMenu справа (ml-auto, justify-end) + MobileNav скрыт"],
                    ["Мобайл (<768px)", "Логотип text_logo + MobileNav (бургер, ml-auto). RocketmindMenu скрыт (hero-menu-desktop)"],
                  ].map(([ctx, behavior]) => (
                    <tr key={ctx} className="border-b border-border last:border-0">
                      <td className="px-4 py-2 font-medium text-foreground whitespace-nowrap align-top">{ctx}</td>
                      <td className="px-4 py-2">{behavior}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </SpecBlock>

        <SpecBlock title="Токены и стили">
          <div className="overflow-auto rounded-lg border border-border">
            <table className="w-full text-[length:var(--text-14)]">
              <thead>
                <tr className="border-b border-border bg-rm-gray-2/30">
                  <th className="text-left px-4 py-2 font-medium">Свойство</th>
                  <th className="text-left px-4 py-2 font-medium">Токен / класс</th>
                  <th className="text-left px-4 py-2 font-medium">Значение</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["Позиция",      "fixed top-0 left-0 right-0",       "Фиксированная, на всю ширину"],
                  ["Высота",       "h-16",                              "64px"],
                  ["z-index",      "z-50",                              "Поверх всего контента"],
                  ["Фон",          "bg-background",                     "Непрозрачный фон (не blur, в отличие от hero)"],
                  ["Бордер",       "border-b border-border",            "Постоянный нижний бордер"],
                  ["Контейнер",    "max-w-[1512px] mx-auto",            "Центрирован, padding: px-5 md:px-8 xl:px-14"],
                  ["Логотип",      "text_logo_dark_background_en.svg",  "w-[120px] md:w-[144px], h-auto"],
                  ["Анимация",     "transition-all duration-300",       "translate-y + opacity при показе/скрытии"],
                  ["Скрыто",       "-translate-y-full opacity-0",       "pointer-events-none когда скрыто"],
                ].map(([prop, token, value]) => (
                  <tr key={prop} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 font-medium text-foreground">{prop}</td>
                    <td className="px-4 py-2"><TokenChip>{token}</TokenChip></td>
                    <td className="px-4 py-2">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SpecBlock>

        <SpecBlock title="Структура компонента">
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-border bg-rm-gray-2/30 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-muted-foreground space-y-1">
              <p>{'import { Header } from "@/components/sections/Header";'}</p>
              <p>&nbsp;</p>
              <p className="text-muted-foreground/60">{'// Файл: apps/site/src/components/sections/Header.tsx'}</p>
              <p className="text-muted-foreground/60">{'// Внутри использует: RocketmindMenu + MobileNav'}</p>
              <p>&nbsp;</p>
              <p>{'<Header />'}</p>
            </div>
          </div>
        </SpecBlock>

        {/* ═══════════════════════════════════════════════════════════════
            2. ШАПКА HERO — встроенная навигация в hero главной
           ═══════════════════════════════════════════════════════════════ */}
        <SubSection id="cross-header-hero" title="Hero Header — Навигация в hero-блоке" />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
          Навигация внутри hero-секции главной страницы. Не является отдельной шапкой — это часть hero-контента.
          Десктоп: <code className="text-foreground">RocketmindMenu</code> прижат вправо, рядом с ним блок статистики и бургер.
          Мобайл: только бургер <code className="text-foreground">MobileNav</code>, меню скрыто.
        </p>

        {/* ── Static preview: hero nav ── */}
        <div className="rounded-lg border border-border overflow-hidden mb-8 isolate relative z-0">
          <div className="bg-[#0A0A0A] p-5 md:p-8">
            {/* Top bar */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="font-heading text-[18px] font-bold uppercase leading-[1.2] text-foreground">
                  <span className="text-muted-foreground">120+ клиентов </span>19 лет опыта
                </span>
              </div>
              <div className="flex h-7 w-10 items-center justify-center md:hidden">
                <div className="relative h-[10px] w-[40px]">
                  <span className="absolute left-0 block h-[2px] w-full rounded-full bg-foreground top-0" />
                  <span className="absolute left-0 block h-[2px] w-full rounded-full bg-foreground top-[8px]" />
                </div>
              </div>
            </div>
            {/* Desktop nav */}
            <div className="hidden md:flex items-center justify-end gap-x-7 gap-y-4 flex-wrap">
              {[...NAV_LABELS_DROPDOWN].map(l => (
                <span key={l} className="inline-flex items-center gap-1.5 font-mono text-[20px] uppercase leading-[1.16] tracking-[0.36px] text-foreground">
                  {l}
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M1 1L5 5L9 1" /></svg>
                </span>
              ))}
              {[...NAV_LABELS_PLAIN].map(l => (
                <span key={l} className="font-mono text-[20px] uppercase leading-[1.16] tracking-[0.36px] text-foreground">{l}</span>
              ))}
            </div>
          </div>
        </div>

        <SpecBlock title="Поведение и отличия от фиксированной шапки">
          <div className="overflow-auto rounded-lg border border-border">
            <table className="w-full text-[length:var(--text-14)]">
              <thead>
                <tr className="border-b border-border bg-rm-gray-2/30">
                  <th className="text-left px-4 py-2 font-medium">Параметр</th>
                  <th className="text-left px-4 py-2 font-medium">Hero Header</th>
                  <th className="text-left px-4 py-2 font-medium">Fixed Header</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["Позиция",      "Inline, часть hero-контента",               "fixed top-0"],
                  ["Фон",          "Прозрачный (фон hero)",                      "bg-background, border-b"],
                  ["Логотип",      "Большой wordmark на всю ширину hero",        "Маленький text_logo (144px)"],
                  ["Навигация",    "RocketmindMenu, justify-end, 20px шрифт",   "RocketmindMenu, 18px шрифт (!text-[18px])"],
                  ["Dropdown",     "Radix viewport, right-0, до AI-продукты",   "Radix viewport, right-0, до AI-продукты"],
                  ["Стат. блок",   "«120+ клиентов · 19 лет опыта» слева",      "Нет"],
                  ["Бургер",       "MobileNav в top-bar-right",                  "MobileNav справа, ml-auto"],
                  ["Анимация",     "motion fadeUp при загрузке hero",            "translate-y при скролле"],
                  ["Видимость",    "Только в hero, до скролла",                  "Появляется при скролле за 50vh"],
                ].map(([param, hero, fixed]) => (
                  <tr key={param} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 font-medium text-foreground whitespace-nowrap">{param}</td>
                    <td className="px-4 py-2">{hero}</td>
                    <td className="px-4 py-2">{fixed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SpecBlock>

        <SpecBlock title="Токены hero-навигации">
          <div className="overflow-auto rounded-lg border border-border">
            <table className="w-full text-[length:var(--text-14)]">
              <thead>
                <tr className="border-b border-border bg-rm-gray-2/30">
                  <th className="text-left px-4 py-2 font-medium">Свойство</th>
                  <th className="text-left px-4 py-2 font-medium">Токен / класс</th>
                  <th className="text-left px-4 py-2 font-medium">Значение</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["Контейнер",       "relative z-10 flex items-center",     "Обёртка RocketmindMenu"],
                  ["Шрифт",           "font-mono text-[20px] uppercase",     "tracking-[0.36px], leading-[1.16]"],
                  ["Layout",          "justify-end flex-wrap gap-x-7",       "Прижато вправо, переносит на новую строку"],
                  ["Dropdown viewport","[&>div]:right-0 [&>div]:left-auto",  "Привязан к правому краю NavigationMenu (до AI-продукты)"],
                  ["Dropdown ширина",  "w-[680px] / w-[420px]",              ">4 items → 680px 3-col, ≤4 → 420px 2-col"],
                  ["Hover",           "hover:opacity-[0.88]",                "Затемнение триггеров"],
                  ["Open state",      "data-[state=open]:opacity-[0.88]",    "Активный триггер"],
                  ["Клик по триггеру","onClick → router.push(item.href)",    "Навигация на разводящую страницу (/consulting и т.д.)"],
                ].map(([prop, token, value]) => (
                  <tr key={prop} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 font-medium text-foreground">{prop}</td>
                    <td className="px-4 py-2"><TokenChip>{token}</TokenChip></td>
                    <td className="px-4 py-2">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SpecBlock>

        <SpecBlock title="Архитектура: RocketmindMenu">
          <div className="space-y-4">
            <p className="text-[length:var(--text-14)] text-muted-foreground">
              Общий компонент для hero и fixed-шапки. Разделяет nav-items на две группы:
              пункты с dropdown (Radix NavigationMenu) и plain-ссылки (отдельный &lt;nav&gt;).
              Это позволяет viewport привязать к правому краю последнего dropdown-триггера (AI-продукты),
              а не к крайнему пункту меню (Медиа).
            </p>
            <div className="p-4 rounded-lg border border-border bg-rm-gray-2/30 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-muted-foreground space-y-1">
              <p>{'import { RocketmindMenu } from "@/components/sections/RocketmindMenu";'}</p>
              <p>&nbsp;</p>
              <p className="text-muted-foreground/60">{'// Hero — крупный шрифт, прижато вправо'}</p>
              <p>{'<RocketmindMenu className="w-full flex-wrap justify-end gap-x-7 gap-y-4" />'}</p>
              <p>&nbsp;</p>
              <p className="text-muted-foreground/60">{'// Fixed header — мельче, с gap'}</p>
              <p>{'<RocketmindMenu className="ml-auto flex-1 justify-end gap-5 lg:gap-7" itemClassName="!text-[18px]" />'}</p>
            </div>

            <div className="overflow-auto rounded-lg border border-border">
              <table className="w-full text-[length:var(--text-14)]">
                <thead>
                  <tr className="border-b border-border bg-rm-gray-2/30">
                    <th className="text-left px-4 py-2 font-medium">Prop</th>
                    <th className="text-left px-4 py-2 font-medium">Тип</th>
                    <th className="text-left px-4 py-2 font-medium">По умолчанию</th>
                    <th className="text-left px-4 py-2 font-medium">Описание</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  {[
                    ["className",     "string",  '""',   "Классы внешнего flex-контейнера (layout, gap, justify)"],
                    ["itemClassName", "string",  '""',   "Классы каждого nav-item / trigger (размер шрифта)"],
                    ["showDropdowns", "boolean", "true", "false — все пункты рендерятся как plain-ссылки"],
                  ].map(([prop, type, def, desc]) => (
                    <tr key={prop} className="border-b border-border last:border-0">
                      <td className="px-4 py-2 font-medium text-foreground"><code>{prop}</code></td>
                      <td className="px-4 py-2"><TokenChip>{type}</TokenChip></td>
                      <td className="px-4 py-2"><code>{def}</code></td>
                      <td className="px-4 py-2">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </SpecBlock>

        {/* ═══════════════════════════════════════════════════════════════
            3. МОБИЛЬНАЯ НАВИГАЦИЯ — MobileNav
           ═══════════════════════════════════════════════════════════════ */}
        <SubSection id="cross-header-mobile" title="MobileNav — Мобильная навигация" />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
          Полноэкранное мобильное меню с круговой анимацией раскрытия (clip-path circle) из точки бургера.
          Белый фон, чёрный текст. Accordion-секции для dropdown-групп. Первый пункт в каждой группе — «Перейти к разделу».
        </p>

        {/* ── Static preview: mobile nav ── */}
        <div className="rounded-lg border border-border overflow-hidden mb-8 isolate relative z-0">
          <div className="bg-white p-5 max-w-[375px] mx-auto">
            {/* Burger preview */}
            <div className="flex items-center justify-between mb-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-black/30">Navigation</p>
              <div className="relative h-[10px] w-[40px]">
                <span className="absolute left-0 block h-[2px] w-full rounded-full bg-black top-[4px] rotate-45" />
                <span className="absolute left-0 block h-[2px] w-full rounded-full bg-black top-[4px] -rotate-45" />
              </div>
            </div>
            {/* Accordion items preview */}
            <div className="space-y-0">
              {[
                { label: "Консалтинг и стратегии", expanded: true, items: ["Перейти к разделу", "Экосистемная стратегия", "Цифровая платформа"] },
                { label: "Онлайн-школа", expanded: false, items: [] },
                { label: "AI-продукты", expanded: false, items: [] },
                { label: "О Rocketmind", expanded: false, items: [] },
                { label: "Медиа", expanded: false, items: [] },
              ].map(group => (
                <div key={group.label} className="border-b border-black/10">
                  <div className="flex w-full items-center justify-between gap-4 py-5">
                    <span className="font-mono text-[22px] font-light uppercase leading-[1.16] tracking-[0.02em] text-black">{group.label}</span>
                    {group.items.length > 0 || group.expanded ? (
                      <svg width="12" height="7" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 text-black/30 ${group.expanded ? "rotate-180" : ""}`}>
                        <path d="M1 1L5 5L9 1" />
                      </svg>
                    ) : null}
                  </div>
                  {group.expanded && group.items.length > 0 && (
                    <div className="grid gap-0.5 pb-5">
                      {group.items.map((item, i) => (
                        <div key={item} className={`rounded-sm px-3 py-3 ${i === 0 ? "border-b border-black/10 mb-1" : ""}`}>
                          <span className={`block font-mono text-[13px] uppercase tracking-[0.06em] ${i === 0 ? "text-black/50" : "text-black"}`}>{item}</span>
                          {i > 0 && <span className="mt-1 block text-[13px] leading-[1.45] text-black/50">Описание подпункта</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <SpecBlock title="Поведение и анимация">
          <div className="overflow-auto rounded-lg border border-border">
            <table className="w-full text-[length:var(--text-14)]">
              <thead>
                <tr className="border-b border-border bg-rm-gray-2/30">
                  <th className="text-left px-4 py-2 font-medium">Параметр</th>
                  <th className="text-left px-4 py-2 font-medium">Значение</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["Триггер",           "Бургер: 2 бара, w-[40px] h-[10px], bar h-[2px], gap 8px. Трансформируется в X при открытии"],
                  ["Открытие",          "clip-path: circle() из центра бургера → 2000px. Duration 0.75s, ease [0.76, 0, 0.24, 1]"],
                  ["Закрытие",          "clip-path: circle(2000px) → circle(0). Duration 0.65s"],
                  ["Фон панели",        "bg-white (#FFFFFF), fixed inset-0, z-[55]"],
                  ["Кнопка закрытия",   "Та же позиция что и бургер (top/right из getBoundingClientRect). X-иконка barClass='bg-black'"],
                  ["Body scroll lock",  "document.body.style.overflow = 'hidden' при открытии"],
                  ["Escape",            "Закрывает меню по нажатию Escape"],
                  ["z-index бургера",   "z-[60] — поверх панели (z-[55])"],
                ].map(([param, value]) => (
                  <tr key={param} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 font-medium text-foreground whitespace-nowrap">{param}</td>
                    <td className="px-4 py-2">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SpecBlock>

        <SpecBlock title="Токены мобильного меню">
          <div className="overflow-auto rounded-lg border border-border">
            <table className="w-full text-[length:var(--text-14)]">
              <thead>
                <tr className="border-b border-border bg-rm-gray-2/30">
                  <th className="text-left px-4 py-2 font-medium">Элемент</th>
                  <th className="text-left px-4 py-2 font-medium">Токен / класс</th>
                  <th className="text-left px-4 py-2 font-medium">Значение</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["Контейнер",           "px-5 pb-16 pt-28 md:px-24",               "Отступы навигации внутри панели"],
                  ["Заголовок",           "font-mono text-[11px] text-black/30",       "'Navigation', uppercase, tracking-[0.1em]"],
                  ["Пункт меню",          "font-mono text-[22px] font-light",          "uppercase, tracking-[0.02em], text-black"],
                  ["Разделитель",         "border-b border-black/10",                  "Между каждым пунктом"],
                  ["Chevron",             "w-12 h-7 stroke-1.5",                       "text-black/30, rotate-180 при раскрытии"],
                  ["«Перейти к разделу»", "font-mono text-[13px] text-black/50",       "Первый пункт в accordion, border-b, mb-1"],
                  ["Подпункт title",      "font-mono text-[13px] text-black",          "uppercase, tracking-[0.06em]"],
                  ["Подпункт desc",       "text-[13px] text-black/50",                 "leading-[1.45], mt-1"],
                  ["Hover подпункта",     "hover:bg-black/5",                          "transition-colors duration-150"],
                  ["Stagger анимация",    "delay: 0.25 + index * 0.07",                "Последовательное появление пунктов"],
                  ["Accordion",           "height: 0 → auto, opacity: 0 → 1",          "duration 0.3s / 0.25s"],
                ].map(([elem, token, value]) => (
                  <tr key={elem} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 font-medium text-foreground whitespace-nowrap">{elem}</td>
                    <td className="px-4 py-2"><TokenChip>{token}</TokenChip></td>
                    <td className="px-4 py-2">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SpecBlock>

        <SpecBlock title="Структура компонента">
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-border bg-rm-gray-2/30 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-muted-foreground space-y-1">
              <p>{'import { MobileNav } from "@/components/sections/MobileNav";'}</p>
              <p>&nbsp;</p>
              <p className="text-muted-foreground/60">{'// Файл: apps/site/src/components/sections/MobileNav.tsx'}</p>
              <p className="text-muted-foreground/60">{'// Данные: импортирует HEADER_NAV из @/content/site-nav'}</p>
              <p className="text-muted-foreground/60">{'// Рендер: React Portal → document.body'}</p>
              <p className="text-muted-foreground/60">{'// Анимация: motion/react (Framer Motion)'}</p>
              <p>&nbsp;</p>
              <p>{'<MobileNav className="ml-auto" />'}</p>
            </div>
          </div>
        </SpecBlock>

        {/* ═══════════════════════════════════════════════════════════════
            4. НАВИГАЦИОННЫЕ ДАННЫЕ
           ═══════════════════════════════════════════════════════════════ */}
        <SubSection id="cross-header-nav-data" title="Навигационные данные" />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
          Единый источник: <code className="text-foreground">apps/site/src/content/site-nav.ts</code>.
          Используется в Header, RocketmindMenu, MobileNav и Footer.
        </p>

        <SpecBlock title="HEADER_NAV">
          <div className="overflow-auto rounded-lg border border-border">
            <table className="w-full text-[length:var(--text-14)]">
              <thead>
                <tr className="border-b border-border bg-rm-gray-2/30">
                  <th className="text-left px-4 py-2 font-medium">Группа</th>
                  <th className="text-left px-4 py-2 font-medium">Тип</th>
                  <th className="text-left px-4 py-2 font-medium">href</th>
                  <th className="text-left px-4 py-2 font-medium">Подпункты</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["Консалтинг и стратегии", "Dropdown (8)", "/consulting",  "Экосистемная стратегия, Цифровая платформа, Умная аналитика, Готовность команды, Стратегические сессии, Дизайн-спринты, Резидент Сколково, Готовность бизнеса"],
                  ["Онлайн-школа",           "Dropdown (2)", "/academy",     "Бизнес-дизайн для команд, Бизнес-дизайн. Быстрый старт"],
                  ["AI-продукты",            "Dropdown (2)", "/ai-products", "Тестирование гипотез, Моделирование бизнеса"],
                  ["О Rocketmind",           "Link",         "/about",       "—"],
                  ["Медиа",                  "Link",         "/media",       "—"],
                ].map(([group, type, href, items]) => (
                  <tr key={group} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 font-medium text-foreground">{group}</td>
                    <td className="px-4 py-2"><TokenChip>{type}</TokenChip></td>
                    <td className="px-4 py-2"><code>{href}</code></td>
                    <td className="px-4 py-2">{items}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SpecBlock>

        <SpecBlock title="Важные инструкции">
          <div className="space-y-4">
            <div className="overflow-auto rounded-lg border border-border">
              <table className="w-full text-[length:var(--text-14)]">
                <thead>
                  <tr className="border-b border-border bg-rm-gray-2/30">
                    <th className="text-left px-4 py-2 font-medium">Действие</th>
                    <th className="text-left px-4 py-2 font-medium">Инструкция</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  {[
                    ["Добавить пункт меню",       "Добавить в HEADER_NAV в site-nav.ts. Если с dropdown — добавить массив items. Компоненты автоматически подхватят изменения"],
                    ["Изменить порядок",           "Изменить порядок в массиве HEADER_NAV. Dropdown-пункты рендерятся в Radix NavigationMenu, plain-ссылки — в отдельный <nav>"],
                    ["Viewport dropdown",          "Привязан к правому краю NavigationMenu (до последнего dropdown-триггера). Plain-ссылки вынесены за пределы NavigationMenu, чтобы viewport не уезжал под них"],
                    ["Ширина dropdown",            "Авто: >4 items → w-[680px] grid-cols-3, ≤4 items → w-[420px] grid-cols-2. Изменяется в RocketmindMenu.tsx"],
                    ["Мобайл: «Перейти к разделу»","Первый пункт в каждом accordion. Ведёт на item.href (разводящая страница). Стиль: text-black/50, border-b"],
                    ["Клик по триггеру desktop",   "onClick → router.push(item.href). Hover открывает dropdown, клик — навигация"],
                    ["Файлы компонентов",          "Header.tsx, RocketmindMenu.tsx, MobileNav.tsx — все в apps/site/src/components/sections/"],
                  ].map(([action, instruction]) => (
                    <tr key={action} className="border-b border-border last:border-0">
                      <td className="px-4 py-2 font-medium text-foreground whitespace-nowrap align-top">{action}</td>
                      <td className="px-4 py-2">{instruction}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </SpecBlock>

        {/* ── Logo Marquee ── */}
        <SubSection id="cross-marquee" title="InfiniteLogoMarquee" />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
          Бесконечная бегущая строка логотипов партнёров / клиентов. CSS-анимация (не JS), fade по краям через mask-image. Компонент из <code className="text-foreground">@rocketmind/ui</code>.
        </p>

        {/* ── Live preview ── */}
        <div className="rounded-lg border border-border py-8 mb-8 bg-[#0A0A0A] overflow-hidden">
          <div className="mx-auto max-w-[1056px]">
            <InfiniteLogoMarquee logos={DEMO_LOGOS} reverse />
          </div>
        </div>

        <SpecBlock title="Props и применение">
          <div className="space-y-6">
            <div className="overflow-auto rounded-lg border border-border">
              <table className="w-full text-[length:var(--text-14)]">
                <thead>
                  <tr className="border-b border-border bg-rm-gray-2/30">
                    <th className="text-left px-4 py-2 font-medium">Prop</th>
                    <th className="text-left px-4 py-2 font-medium">Тип</th>
                    <th className="text-left px-4 py-2 font-medium">По умолчанию</th>
                    <th className="text-left px-4 py-2 font-medium">Описание</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  {[
                    ["logos",          "LogoMarqueeItem[]", "—",   "Массив логотипов { alt, src, width?, height? }"],
                    ["speedSeconds",   "number",            "25",  "Длительность одного цикла анимации"],
                    ["gap",           "number",            "67",  "Расстояние между логотипами (px)"],
                    ["maxLogoHeight", "number",            "39",  "Максимальная высота логотипа (px)"],
                    ["fadeWidth",     "number",            "44",  "Ширина fade-маски по краям (px)"],
                    ["reverse",      "boolean",           "false", "Направление: true — слева направо"],
                    ["className",    "string",            "—",   "Дополнительные классы контейнера"],
                  ].map(([prop, type, def, desc]) => (
                    <tr key={prop} className="border-b border-border last:border-0">
                      <td className="px-4 py-2 font-medium text-foreground"><code>{prop}</code></td>
                      <td className="px-4 py-2"><TokenChip>{type}</TokenChip></td>
                      <td className="px-4 py-2"><code>{def}</code></td>
                      <td className="px-4 py-2">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 rounded-lg border border-border bg-rm-gray-2/30 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-muted-foreground space-y-1">
              <p>{'import { InfiniteLogoMarquee } from "@rocketmind/ui";'}</p>
              <p>&nbsp;</p>
              <p>{'<InfiniteLogoMarquee logos={logos} reverse />'}</p>
            </div>
            <div className="overflow-auto rounded-lg border border-border">
              <table className="w-full text-[length:var(--text-14)]">
                <thead>
                  <tr className="border-b border-border bg-rm-gray-2/30">
                    <th className="text-left px-4 py-2 font-medium">Действие</th>
                    <th className="text-left px-4 py-2 font-medium">Инструкция</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  {[
                    ["Добавить логотип",   "Положить SVG в apps/site/public/clip-logos/. Имя = kebab-case slug, например sberbank.svg."],
                    ["Удалить логотип",    "Удалить файл из apps/site/public/clip-logos/."],
                    ["Изменить порядок",   "Отредактировать массив preferredOrder в apps/site/src/lib/partner-logos.ts."],
                  ].map(([action, instruction]) => (
                    <tr key={action} className="border-b border-border last:border-0">
                      <td className="px-4 py-2 font-medium text-foreground whitespace-nowrap">{action}</td>
                      <td className="px-4 py-2">{instruction}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 rounded-lg border border-border bg-rm-gray-2/30 text-[length:var(--text-14)] text-muted-foreground space-y-2">
              <p><span className="text-foreground font-medium">Форматы:</span> SVG (рек.), PNG, WebP, AVIF, JPG. Монохромный белый/серый.</p>
              <p><span className="text-foreground font-medium">Размер:</span> viewBox ~100-170px × 32-40px. Именование: kebab-case.</p>
            </div>
          </div>
        </SpecBlock>
      </Section>

      <Separator />
    </>
  )
}
