"use client";

import { useState, useCallback, useRef } from "react";
import { GripVertical, ChevronDown, ChevronRight, EyeOff } from "lucide-react";
import { Switch } from "@rocketmind/ui";
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
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [draggableId, setDraggableId] = useState<string | null>(null);
  const rowRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const sorted = [...blocks].sort((a, b) => a.order - b.order);

  const toggleCollapse = useCallback((blockId: string) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(blockId)) next.delete(blockId);
      else next.add(blockId);
      return next;
    });
  }, []);

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
    setDraggableId(null);
  }, []);

  const handleGripMouseDown = useCallback((blockId: string) => {
    setDraggableId(blockId);
  }, []);

  const handleGripMouseUp = useCallback(() => {
    setDraggableId(null);
  }, []);

  return (
    <div className="flex flex-col gap-0">
      {sorted.map((block) => {
        const info = BLOCK_TYPES[block.type];
        const isCollapsed = collapsedIds.has(block.id);
        const isDragging = dragId === block.id;
        const isDragOver = dragOverId === block.id && dragId !== block.id;

        return (
          <div
            key={block.id}
            ref={(el) => {
              if (el) rowRefs.current.set(block.id, el);
              else rowRefs.current.delete(block.id);
            }}
            draggable={draggableId === block.id}
            onDragStart={(e) => handleDragStart(e, block.id)}
            onDragOver={(e) => handleDragOver(e, block.id)}
            onDrop={(e) => handleDrop(e, block.id)}
            onDragEnd={handleDragEnd}
            className={`relative transition-all ${
              isDragging
                ? "opacity-50"
                : isDragOver
                  ? "ring-2 ring-[var(--rm-yellow-300)]"
                  : ""
            }`}
          >
            {/* Block toolbar — floating bar */}
            <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-background/95 px-3 py-1.5 backdrop-blur-sm">
              <div
                className="cursor-grab text-muted-foreground active:cursor-grabbing select-none"
                onMouseDown={() => handleGripMouseDown(block.id)}
                onMouseUp={handleGripMouseUp}
              >
                <GripVertical className="h-4 w-4" />
              </div>

              <button
                className="flex flex-1 items-center gap-2 text-left"
                onClick={() => toggleCollapse(block.id)}
              >
                {isCollapsed ? (
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                )}
                <span className="text-[length:var(--text-12)] font-medium uppercase tracking-wider text-muted-foreground">
                  {info?.label || block.type}
                </span>
              </button>

              {!block.enabled && (
                <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
              )}

              <Switch
                checked={block.enabled}
                onCheckedChange={() => onToggleBlock(block.id)}
                size="sm"
              />
            </div>

            {/* Block preview */}
            {!isCollapsed && (
              <div className={!block.enabled ? "pointer-events-none opacity-30" : ""}>
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
