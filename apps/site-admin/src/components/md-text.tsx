"use client";

import { RichText } from "@rocketmind/ui";

type MdTextProps = {
  value: string;
  placeholder?: string;
  className?: string;
  as?: "p" | "span";
};

/**
 * Renders saved text with markdown-list recognition (bullets / numbered).
 * Falls back to a styled placeholder when empty.
 */
export function MdText({ value, placeholder = "", className, as = "p" }: MdTextProps) {
  if (value) return <RichText text={value} className={className} />;
  const Tag = as;
  return <Tag className={className}>{placeholder}</Tag>;
}
