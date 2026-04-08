"use client";

import { useState, useCallback } from "react";
import { GripVertical, ChevronDown, ChevronRight } from "lucide-react";
import { Switch, Badge } from "@rocketmind/ui";
import type { PageBlock } from "@/lib/types";
import { BLOCK_TYPES } from "@/lib/constants";
import { BlockEditor } from "./block-editors/block-editor";

interface BlockListProps {
  blocks: PageBlock[];
  onToggleBlock: (blockId: string) => void;
  onUpdateBlock: (blockId: string, data: Record<string, unknown>) => void;
  onReorderBlocks: (orderedIds: string[]) => void;
}

export function BlockList({
  blocks,
  onToggleBlock,
  onUpdateBlock,
  onReorderBlocks,
}: BlockListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const sorted = [...blocks].sort((a, b) => a.order - b.order);

  const handleDragStart = useCallback(
    (e: React.DragEvent, blockId: string) => {
      setDragId(blockId);
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", blockId);
    },
    []
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent, blockId: string) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (blockId !== dragOverId) {
        setDragOverId(blockId);
      }
    },
    [dragOverId]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, targetId: string) => {
      e.preventDefault();
      const sourceId = e.dataTransfer.getData("text/plain");
      if (!sourceId || sourceId === targetId) {
        setDragId(null);
        setDragOverId(null);
        return;
      }

      const ids = sorted.map((b) => b.id);
      const sourceIdx = ids.indexOf(sourceId);
      const targetIdx = ids.indexOf(targetId);

      if (sourceIdx === -1 || targetIdx === -1) return;

      ids.splice(sourceIdx, 1);
      ids.splice(targetIdx, 0, sourceId);

      onReorderBlocks(ids);
      setDragId(null);
      setDragOverId(null);
    },
    [sorted, onReorderBlocks]
  );

  const handleDragEnd = useCallback(() => {
    setDragId(null);
    setDragOverId(null);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {sorted.map((block) => {
        const info = BLOCK_TYPES[block.type];
        const isExpanded = expandedId === block.id;
        const isDragging = dragId === block.id;
        const isDragOver = dragOverId === block.id && dragId !== block.id;

        return (
          <div
            key={block.id}
            draggable
            onDragStart={(e) => handleDragStart(e, block.id)}
            onDragOver={(e) => handleDragOver(e, block.id)}
            onDrop={(e) => handleDrop(e, block.id)}
            onDragEnd={handleDragEnd}
            className={`rounded-sm border transition-all ${
              isDragging
                ? "border-dashed border-muted-foreground opacity-50"
                : isDragOver
                  ? "border-[var(--rm-yellow-300)] bg-[var(--rm-yellow-900)]"
                  : "border-border bg-background"
            }`}
          >
            {/* Block header */}
            <div className="flex items-center gap-2 px-3 py-2">
              <div className="cursor-grab text-muted-foreground active:cursor-grabbing">
                <GripVertical className="h-4 w-4" />
              </div>

              <button
                className="flex flex-1 items-center gap-2 text-left"
                onClick={() => setExpandedId(isExpanded ? null : block.id)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-[length:var(--text-14)] font-medium text-foreground">
                  {info?.label || block.type}
                </span>
                <span className="text-[length:var(--text-12)] text-muted-foreground">
                  {info?.description}
                </span>
              </button>

              {!block.enabled && (
                <Badge variant="neutral-subtle" size="sm">
                  Скрыт
                </Badge>
              )}

              <Switch
                checked={block.enabled}
                onCheckedChange={() => onToggleBlock(block.id)}
                size="sm"
              />
            </div>

            {/* Block editor (expanded) */}
            {isExpanded && (
              <div className="border-t border-border px-4 py-4">
                <BlockEditor
                  block={block}
                  onUpdate={(data) => onUpdateBlock(block.id, data)}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
