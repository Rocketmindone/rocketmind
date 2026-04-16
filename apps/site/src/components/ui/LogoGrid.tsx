import Image from "next/image";
import type { LogoGridCell } from "@/lib/unique";

type LogoGridProps = {
  cells: LogoGridCell[];
  className?: string;
};

const SIZE_SPAN: Record<LogoGridCell["size"], number> = {
  S: 2,
  M: 3,
  L: 4,
};

/**
 * Bento-style editable logo grid. 6-column base grid on desktop;
 * S=2 cols, M=3 cols, L=4 cols. Auto-flow fills dense.
 * On mobile collapses to 2-column grid.
 */
export function LogoGrid({ cells, className }: LogoGridProps) {
  if (cells.length === 0) {
    return (
      <div
        className={`flex items-center justify-center min-h-[400px] border border-dashed border-[#404040] ${className ?? ""}`}
      >
        <span className="text-[length:var(--text-14)] text-[#5C5C5C]">Логотипы не добавлены</span>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-6 auto-rows-[120px] gap-px bg-[#1A1A1A] border border-[#404040] ${className ?? ""}`}
      style={{ gridAutoFlow: "dense" }}
    >
      {cells.map((cell) => (
        <div
          key={cell.id}
          className="relative flex items-center justify-center bg-[#121212] p-6"
          style={{ gridColumn: `span ${SIZE_SPAN[cell.size]} / span ${SIZE_SPAN[cell.size]}` }}
        >
          {cell.src && (
            <Image
              src={cell.src}
              alt={cell.alt ?? ""}
              width={200}
              height={80}
              className="max-h-full max-w-full object-contain"
              unoptimized={cell.src.endsWith(".svg")}
            />
          )}
        </div>
      ))}
    </div>
  );
}
