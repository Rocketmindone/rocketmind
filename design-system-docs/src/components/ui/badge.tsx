import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  // Base: flat, Loos Condensed, uppercase — consistent with buttons and labels
  "inline-flex items-center gap-1 rounded-sm border border-transparent px-2 whitespace-nowrap font-[family-name:var(--font-mono-family)] uppercase tracking-[0.04em] transition-all",
  {
    variants: {
      variant: {
        // ── Neutral ──────────────────────────────────────────────────────
        neutral:
          "bg-[var(--rm-gray-1)] text-[var(--rm-gray-fg-sub)] border-[var(--border)]",

        // ── Yellow ───────────────────────────────────────────────────────
        "yellow-solid":
          "bg-[var(--rm-yellow-100)] text-[var(--rm-yellow-fg)]",
        "yellow-subtle":
          "bg-[var(--rm-yellow-900)] text-[var(--rm-yellow-fg-subtle)]",

        // ── Violet ───────────────────────────────────────────────────────
        "violet-solid":
          "bg-[var(--rm-violet-100)] text-[var(--rm-violet-fg)]",
        "violet-subtle":
          "bg-[var(--rm-violet-900)] text-[var(--rm-violet-fg-subtle)]",

        // ── Sky ──────────────────────────────────────────────────────────
        "sky-solid":
          "bg-[var(--rm-sky-100)] text-[var(--rm-sky-fg)]",
        "sky-subtle":
          "bg-[var(--rm-sky-900)] text-[var(--rm-sky-fg-subtle)]",

        // ── Terracotta ───────────────────────────────────────────────────
        "terracotta-solid":
          "bg-[var(--rm-terracotta-100)] text-[var(--rm-terracotta-fg)]",
        "terracotta-subtle":
          "bg-[var(--rm-terracotta-900)] text-[var(--rm-terracotta-fg-subtle)]",

        // ── Pink ─────────────────────────────────────────────────────────
        "pink-solid":
          "bg-[var(--rm-pink-100)] text-[var(--rm-pink-fg)]",
        "pink-subtle":
          "bg-[var(--rm-pink-900)] text-[var(--rm-pink-fg-subtle)]",

        // ── Blue ─────────────────────────────────────────────────────────
        "blue-solid":
          "bg-[var(--rm-blue-100)] text-[var(--rm-blue-fg)]",
        "blue-subtle":
          "bg-[var(--rm-blue-900)] text-[var(--rm-blue-fg-subtle)]",

        // ── Red ──────────────────────────────────────────────────────────
        "red-solid":
          "bg-[var(--rm-red-100)] text-[var(--rm-red-fg)]",
        "red-subtle":
          "bg-[var(--rm-red-900)] text-[var(--rm-red-fg-subtle)]",

        // ── Green ────────────────────────────────────────────────────────
        "green-solid":
          "bg-[var(--rm-green-100)] text-[var(--rm-green-fg)]",
        "green-subtle":
          "bg-[var(--rm-green-900)] text-[var(--rm-green-fg-subtle)]",

        // ── Legacy shadcn aliases (backward compat) ──────────────────────
        // "default" was primary/yellow solid; "secondary" was gray neutral
        default:
          "bg-[var(--rm-yellow-100)] text-[var(--rm-yellow-fg)]",
        secondary:
          "bg-[var(--rm-gray-1)] text-[var(--rm-gray-fg-sub)] border-[var(--border)]",
        destructive:
          "bg-[var(--rm-red-100)] text-[var(--rm-red-fg)]",
        outline:
          "border-border text-foreground",
      },
      size: {
        sm: "h-5 text-[length:var(--text-12)]",
        md: "h-6 text-[length:var(--text-12)]",
        lg: "h-7 text-[length:var(--text-14)]",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "md",
    },
  }
)

export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"]
export type BadgeSize = VariantProps<typeof badgeVariants>["size"]

function Badge({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
