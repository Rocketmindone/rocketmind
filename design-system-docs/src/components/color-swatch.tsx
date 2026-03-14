"use client"

import { useState, useCallback, useRef } from "react"
import { toast } from "sonner"
import { CopyButton } from "./copy-button"

function computeHex(el: HTMLElement): string {
  const bg = getComputedStyle(el).backgroundColor
  const m = bg.match(/(\d+)/g)
  if (!m) return ""
  return "#" + [+m[0], +m[1], +m[2]].map(v => v.toString(16).padStart(2, "0")).join("")
}

function useColorBlock() {
  const ref = useRef<HTMLDivElement>(null)
  const [hex, setHex] = useState("")
  const [hovered, setHovered] = useState(false)

  const onMouseEnter = useCallback(() => {
    if (!ref.current) return
    setHex(computeHex(ref.current))
    setHovered(true)
  }, [])

  const onMouseLeave = useCallback(() => setHovered(false), [])

  const onClick = useCallback(() => {
    if (!ref.current) return
    const h = computeHex(ref.current)
    if (!h) return
    navigator.clipboard.writeText(h)
    toast.success("Скопировано в буфер обмена", { description: `HEX: ${h}`, duration: 2000 })
  }, [])

  return { ref, hex, hovered, onMouseEnter, onMouseLeave, onClick }
}

interface ColorSwatchProps {
  name: string
  token: string
  lightHex: string
  darkHex: string
  className?: string
}

export function ColorSwatch({ name, token, lightHex, darkHex, className }: ColorSwatchProps) {
  const { ref, hex, hovered, onMouseEnter, onMouseLeave, onClick } = useColorBlock()

  return (
    <div className={`flex flex-col gap-2 ${className || ""}`}>
      <div
        ref={ref}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="relative w-full h-20 rounded-md border border-border cursor-pointer hover:border-muted-foreground dark:hover:border-white/[0.12] transition-all duration-150"
        style={{ backgroundColor: lightHex }}
      >
        {hovered && hex && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[11px] font-[family-name:var(--font-mono-family)] text-foreground">{hex}</span>
          </div>
        )}
      </div>
      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0">
          <p className="text-[length:var(--text-14)] font-medium truncate">{name}</p>
          <p className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)] truncate">{token}</p>
          <div className="flex gap-2 text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)]">
            <span>L: {lightHex}</span>
            <span>D: {darkHex}</span>
          </div>
        </div>
        <CopyButton value={token} label={`Токен: ${token}`} />
      </div>
    </div>
  )
}

export function ColorSwatchLive({
  name,
  cssVar,
  token,
  lightHex,
  darkHex,
  twClass,
}: {
  name: string
  cssVar: string
  token: string
  lightHex?: string
  darkHex?: string
  twClass?: string
}) {
  const { ref, hex, hovered, onMouseEnter, onMouseLeave, onClick } = useColorBlock()

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={ref}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="relative w-full h-20 rounded-md border border-border cursor-pointer hover:border-muted-foreground dark:hover:border-white/[0.12] transition-all duration-150"
        style={{ backgroundColor: `var(${cssVar})` }}
      >
        {hovered && hex && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[11px] font-[family-name:var(--font-mono-family)] text-foreground">{hex}</span>
          </div>
        )}
      </div>
      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0">
          <p className="text-[length:var(--text-14)] font-medium truncate">{name}</p>
          <p className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)] truncate">{token}</p>
          {(lightHex || darkHex) && (
            <div className="flex flex-wrap gap-x-2 text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)]">
              {lightHex && <span>L: {lightHex}</span>}
              {darkHex && <span>D: {darkHex}</span>}
            </div>
          )}
          {twClass && (
            <p className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)] truncate">{twClass}</p>
          )}
        </div>
        <CopyButton value={token} label={`Токен: ${token}`} />
      </div>
    </div>
  )
}
