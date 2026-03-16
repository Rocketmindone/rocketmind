'use client'

import React from 'react'
import { createPortal } from 'react-dom'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ── Hook: detect scroll past threshold ── */
function useScroll(threshold: number) {
  const [scrolled, setScrolled] = React.useState(false)
  const onScroll = React.useCallback(() => {
    setScrolled(window.scrollY > threshold)
  }, [threshold])
  React.useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [onScroll])
  React.useEffect(() => { onScroll() }, [onScroll])
  return scrolled
}

/* ── Nav links ── */
const NAV_LINKS = [
  { label: 'Продукты', href: '#' },
  { label: 'Агенты',   href: '#' },
  { label: 'Тарифы',   href: '#' },
  { label: 'Академия', href: '#' },
  { label: 'О нас',    href: '#' },
]

type SiteHeaderProps = {
  /** Base path for logo images (e.g. "/rocketmind-design-system" in prod) */
  basePath?: string
  /** Preview mode: disables sticky positioning (for DS docs demos) */
  preview?: boolean
}

export function SiteHeader({ basePath = '', preview = false }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const scrolled = useScroll(10)

  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <header
      className={cn(
        'z-50 w-full border-b transition-all duration-300',
        preview ? 'relative' : 'sticky top-0',
        scrolled || preview
          ? 'border-border bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur-lg'
          : 'border-transparent bg-transparent',
      )}
    >
      <nav className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-5">

        {/* Logo */}
        <a
          href="#"
          aria-label="Rocketmind"
          className="flex items-center rounded-sm p-1 hover:bg-accent transition-colors duration-150"
        >
          <img
            src={`${basePath}/text_logo_dark_background_en.svg`}
            alt="Rocketmind"
            className="h-7 w-auto hidden dark:block"
          />
          <img
            src={`${basePath}/text_logo_light_background_en.svg`}
            alt="Rocketmind"
            className="h-7 w-auto dark:hidden"
          />
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-3 py-2 rounded-sm font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-150"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2">
          <button className="inline-flex items-center justify-center h-9 px-4 rounded-md border border-border bg-transparent text-foreground font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] transition-all duration-150 hover:bg-accent cursor-pointer">
            Войти
          </button>
          <button className="inline-flex items-center justify-center h-9 px-4 rounded-md bg-[var(--rm-yellow-100)] text-[var(--rm-yellow-fg)] font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] transition-all duration-150 hover:bg-[var(--rm-yellow-300)] cursor-pointer">
            Попробовать
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md border border-border bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground transition-colors duration-150 cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? 'Закрыть меню' : 'Открыть меню'}
        >
          {mobileOpen ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
        </button>
      </nav>

      {/* Mobile menu (portal) */}
      {mobileOpen && typeof window !== 'undefined' && createPortal(
        <div
          id="site-mobile-menu"
          className="fixed top-16 left-0 right-0 bottom-0 z-40 bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur-lg border-t border-border md:hidden"
        >
          <div className="flex flex-col p-4 gap-0.5">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-sm font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-150"
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-border">
              <button className="w-full inline-flex items-center justify-center h-10 px-4 rounded-md border border-border bg-transparent text-foreground font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] transition-all duration-150 hover:bg-accent cursor-pointer">
                Войти
              </button>
              <button className="w-full inline-flex items-center justify-center h-10 px-4 rounded-md bg-[var(--rm-yellow-100)] text-[var(--rm-yellow-fg)] font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] transition-all duration-150 hover:bg-[var(--rm-yellow-300)] cursor-pointer">
                Попробовать
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </header>
  )
}
