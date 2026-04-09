"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ImagePlus } from "lucide-react";
import { Button, Input, Textarea, Separator } from "@rocketmind/ui";
import { toast } from "sonner";
import type { SitePage } from "@/lib/types";
import { useEditor } from "@/lib/use-editor";
import { useAdminStore } from "@/lib/store";
import { InlineEdit } from "@/components/inline-edit";
import { EditorToolbar } from "./editor-toolbar";
import { BlockList } from "./block-list";
import { ConfirmDialog } from "@/components/confirm-dialog";

const DESC_REC_MIN = 60;
const DESC_REC_MAX = 120;

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

  const descLen = (page.menuDescription || "").length;
  const descColor =
    descLen === 0
      ? "text-muted-foreground"
      : descLen < DESC_REC_MIN
        ? "text-[var(--rm-yellow-100)]"
        : descLen > DESC_REC_MAX
          ? "text-destructive"
          : "text-[var(--rm-green-100)]";

  async function handleSave() {
    const savedPage = { ...page, updatedAt: new Date().toISOString() };
    await savePage(savedPage);
    markSaved(savedPage);
    toast.success("Изменения сохранены и записаны в файл");
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
        {/* ── Top section: left fields + right card ──────────────── */}
        <div className="mb-8 flex flex-col gap-8 lg:flex-row">
          {/* Left column — inputs */}
          <div className="flex flex-1 flex-col gap-4">
            <h2 className="text-[length:var(--text-12)] font-medium uppercase tracking-wider text-muted-foreground">
              Основная информация
            </h2>

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
                className="font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[length:var(--text-12)] text-muted-foreground">
                Описание в меню
              </label>
              <Textarea
                value={page.menuDescription}
                onChange={(e) => updateMeta("menuDescription", e.target.value)}
                className="min-h-[60px] text-[length:var(--text-14)]"
              />
              <div className="flex items-center gap-2">
                <span className={`text-[length:var(--text-12)] font-medium ${descColor}`}>
                  {descLen}/{DESC_REC_MIN}–{DESC_REC_MAX}
                </span>
                <span className="text-[length:var(--text-10)] text-muted-foreground">
                  Рекомендуется {DESC_REC_MIN}–{DESC_REC_MAX} символов
                </span>
              </div>
            </div>

            <Separator />

            <h2 className="text-[length:var(--text-12)] font-medium uppercase tracking-wider text-muted-foreground">
              SEO
            </h2>

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

          {/* Right column — product card preview (Figma design) */}
          <div className="flex flex-col gap-3 lg:w-[380px] lg:shrink-0">
            <h2 className="text-[length:var(--text-12)] font-medium uppercase tracking-wider text-muted-foreground">
              Карточка продукта
            </h2>

            <div className="relative rounded-sm border border-[#404040] bg-[#0A0A0A] p-8">
              {/* Arrow button — top right */}
              <div className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-sm border border-[#404040]">
                <ArrowUpRight className="h-3 w-3 text-[#F0F0F0]" />
              </div>

              {/* Icon 120×120 */}
              <div className="mb-8 flex h-[120px] w-[120px] items-center justify-center rounded-sm border border-dashed border-[#404040] text-[#939393] transition-colors hover:border-[#FFCC00] hover:text-[#FFCC00]">
                <ImagePlus className="h-6 w-6" />
              </div>

              {/* Card text — fixed height container like Figma */}
              <div className="flex h-[156px] flex-col justify-between gap-6">
                <InlineEdit
                  value={page.cardTitle}
                  onSave={(v) => updateMeta("cardTitle", v)}
                  multiline
                  placeholder="Название на карточке"
                >
                  <span className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase leading-[1.2] tracking-tight text-[#F0F0F0]">
                    {page.cardTitle || "Название"}
                  </span>
                </InlineEdit>

                <InlineEdit
                  value={page.cardDescription}
                  onSave={(v) => updateMeta("cardDescription", v)}
                  multiline
                  placeholder="Описание на карточке"
                >
                  <span className="text-[length:var(--text-14)] leading-[1.32] text-[#939393]">
                    {page.cardDescription || "Описание продукта"}
                  </span>
                </InlineEdit>
              </div>
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
