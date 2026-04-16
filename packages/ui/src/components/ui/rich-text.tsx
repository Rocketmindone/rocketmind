import { cn } from "../../lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────────

type Block =
  | { kind: "paragraph"; lines: string[] }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[] };

// ── Parser ─────────────────────────────────────────────────────────────────────

const BULLET_RE = /^\s*[-•·–—]\s+(.*)$/;
const NUMBERED_RE = /^\s*\d+[.)]\s+(.*)$/;

function parseBlocks(text: string): Block[] {
  const lines = text.split("\n");
  const blocks: Block[] = [];
  let current: Block | null = null;

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, "");
    const bul = line.match(BULLET_RE);
    const num = line.match(NUMBERED_RE);

    if (bul) {
      if (current?.kind !== "ul") {
        if (current) blocks.push(current);
        current = { kind: "ul", items: [] };
      }
      current.items.push(bul[1]);
    } else if (num) {
      if (current?.kind !== "ol") {
        if (current) blocks.push(current);
        current = { kind: "ol", items: [] };
      }
      current.items.push(num[1]);
    } else if (line.trim() === "") {
      if (current) {
        blocks.push(current);
        current = null;
      }
    } else {
      if (current?.kind !== "paragraph") {
        if (current) blocks.push(current);
        current = { kind: "paragraph", lines: [] };
      }
      current.lines.push(line);
    }
  }
  if (current) blocks.push(current);
  return blocks;
}

// ── Component ──────────────────────────────────────────────────────────────────

export type RichTextProps = {
  text: string;
  className?: string;
  /** Class for inner <p>, <ul>, <ol> elements. */
  blockClassName?: string;
};

/**
 * Renders text with markdown-style list recognition:
 *   - "- text" / "• text" → bullet list
 *   - "1. text" / "1) text" → numbered list
 *   - newline → paragraph break
 *
 * Lists get 4px top spacing and 4px between items.
 */
export function RichText({ text, className, blockClassName }: RichTextProps) {
  if (!text) return null;
  const blocks = parseBlocks(text);
  if (blocks.length === 0) return null;

  return (
    <span className={cn("block", className)}>
      {blocks.map((b, i) => {
        const isFirst = i === 0;
        if (b.kind === "ul") {
          return (
            <ul
              key={i}
              className={cn(
                "list-disc pl-[1.25em]",
                !isFirst && "mt-1",
                "[&>li]:mb-1 [&>li:last-child]:mb-0",
                blockClassName,
              )}
            >
              {b.items.map((it, j) => (
                <li key={j}>{it}</li>
              ))}
            </ul>
          );
        }
        if (b.kind === "ol") {
          return (
            <ol
              key={i}
              className={cn(
                "list-decimal pl-[1.5em]",
                !isFirst && "mt-1",
                "[&>li]:mb-1 [&>li:last-child]:mb-0",
                blockClassName,
              )}
            >
              {b.items.map((it, j) => (
                <li key={j}>{it}</li>
              ))}
            </ol>
          );
        }
        return (
          <p key={i} className={cn(!isFirst && "mt-1", blockClassName)}>
            {b.lines.map((l, j) => (
              <span key={j}>
                {j > 0 && <br />}
                {l}
              </span>
            ))}
          </p>
        );
      })}
    </span>
  );
}
