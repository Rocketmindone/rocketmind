"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button, Input, Textarea, Separator } from "@rocketmind/ui";
import { toast } from "sonner";
import type { SitePage } from "@/lib/types";
import { useEditor } from "@/lib/use-editor";
import { useAdminStore } from "@/lib/store";
import { EditorToolbar } from "./editor-toolbar";
import { BlockList } from "./block-list";
import { ConfirmDialog } from "@/components/confirm-dialog";

interface EditorShellProps {
  initialPage: SitePage;
}

export function EditorShell({ initialPage }: EditorShellProps) {
  const router = useRouter();
  const { savePage } = useAdminStore();
  const {
    page,
    isDirty,
    canUndo,
    canRedo,
    updateMeta,
    updateBlock,
    toggleBlock,
    reorderBlocks,
    updateStatus,
    undo,
    redo,
    markSaved,
    discard,
  } = useEditor(initialPage);

  const [showCancelDialog, setShowCancelDialog] = useState(false);

  function handleSave() {
    const savedPage = { ...page, updatedAt: new Date().toISOString() };
    savePage(savedPage);
    markSaved(savedPage);
    toast.success("Изменения сохранены");
  }

  function handleCancel() {
    if (isDirty) {
      setShowCancelDialog(true);
    } else {
      router.push("/pages");
    }
  }

  function handleConfirmCancel() {
    discard();
    router.push("/pages");
  }

  return (
    <div className="flex flex-1 flex-col pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-6 py-4">
        <Button variant="ghost" size="icon-sm" onClick={handleCancel}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-[length:var(--text-18)] font-semibold text-foreground">
            {page.menuTitle || "Без названия"}
          </h1>
          <p className="text-[length:var(--text-12)] text-muted-foreground">
            /{page.sectionId}/{page.slug}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Meta fields */}
        <div className="mb-8 space-y-4">
          <h2 className="text-[length:var(--text-12)] font-medium uppercase tracking-wider text-muted-foreground">
            Основная информация
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-[length:var(--text-12)] text-muted-foreground">
                Название в меню
              </label>
              <Input
                size="sm"
                value={page.menuTitle}
                onChange={(e) => updateMeta("menuTitle", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[length:var(--text-12)] text-muted-foreground">
                Slug (URL)
              </label>
              <Input
                size="sm"
                value={page.slug}
                onChange={(e) => updateMeta("slug", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[length:var(--text-12)] text-muted-foreground">
                Описание в меню
              </label>
              <Input
                size="sm"
                value={page.menuDescription}
                onChange={(e) => updateMeta("menuDescription", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[length:var(--text-12)] text-muted-foreground">
                Название карточки
              </label>
              <Input
                size="sm"
                value={page.cardTitle}
                onChange={(e) => updateMeta("cardTitle", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[length:var(--text-12)] text-muted-foreground">
                Описание карточки
              </label>
              <Input
                size="sm"
                value={page.cardDescription}
                onChange={(e) => updateMeta("cardDescription", e.target.value)}
              />
            </div>
          </div>

          <Separator />

          <h2 className="text-[length:var(--text-12)] font-medium uppercase tracking-wider text-muted-foreground">
            SEO
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-[length:var(--text-12)] text-muted-foreground">
                Meta Title
              </label>
              <Input
                size="sm"
                value={page.metaTitle}
                onChange={(e) => updateMeta("metaTitle", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[length:var(--text-12)] text-muted-foreground">
                Meta Description
              </label>
              <Textarea
                value={page.metaDescription}
                onChange={(e) => updateMeta("metaDescription", e.target.value)}
                className="min-h-[60px] text-[length:var(--text-14)]"
              />
            </div>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Blocks */}
        <div className="space-y-4">
          <h2 className="text-[length:var(--text-12)] font-medium uppercase tracking-wider text-muted-foreground">
            Блоки страницы
          </h2>

          <BlockList
            blocks={page.blocks}
            onToggleBlock={toggleBlock}
            onUpdateBlock={updateBlock}
            onReorderBlocks={reorderBlocks}
          />
        </div>
      </div>

      {/* Toolbar */}
      <EditorToolbar
        isDirty={isDirty}
        canUndo={canUndo}
        canRedo={canRedo}
        isPublished={page.status === "published"}
        onUndo={undo}
        onRedo={redo}
        onTogglePublish={(published) =>
          updateStatus(published ? "published" : "hidden")
        }
        onSave={handleSave}
        onCancel={handleCancel}
      />

      {/* Cancel confirmation */}
      <ConfirmDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        title="Отменить изменения?"
        description="Все несохранённые изменения будут потеряны."
        confirmLabel="Да, отменить"
        variant="destructive"
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
}
