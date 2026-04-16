"use client";

import { useSearchParams } from "next/navigation";
import { useState, useCallback, Suspense } from "react";
import { Plus, LayoutGrid, List } from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Button,
  Input,
} from "@rocketmind/ui";
import { toast } from "sonner";
import { ADMIN_SECTIONS, LOCKED_SECTIONS } from "@/lib/constants";
import { useAdminStore } from "@/lib/store";
import { useItemDnd } from "@/lib/use-item-dnd";
import { PageCard } from "@/components/page-card";
import { ConfirmDialog } from "@/components/confirm-dialog";

function PagesContent() {
  const searchParams = useSearchParams();
  const initialSection = searchParams.get("section") || "consulting";

  const { getPagesBySection, createPage, setPageStatus, deletePage, reorderPages } =
    useAdminStore();

  const [activeSection, setActiveSection] = useState(initialSection);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const pages = getPagesBySection(activeSection);
  const activePages = pages.filter((p) => p.status !== "archived");
  const archivedPages = pages.filter((p) => p.status === "archived");

  const handleReorder = useCallback(
    (reordered: typeof activePages) => {
      reorderPages(activeSection, reordered.map((p) => p.id));
      toast.success("Порядок сохранён");
    },
    [activeSection, reorderPages]
  );

  const dnd = useItemDnd(activePages, handleReorder);

  async function handleCreate() {
    if (!newTitle.trim()) return;
    const page = await createPage(activeSection, newTitle.trim());
    setNewTitle("");
    setIsCreating(false);
    if (page) {
      toast.success(`Страница «${page.menuTitle}» создана`);
    } else {
      toast.error("Не удалось создать страницу");
    }
  }

  function handleArchive(id: string) {
    setPageStatus(id, "archived");
    toast("Страница перемещена в архив", {
      action: {
        label: "Отменить",
        onClick: () => setPageStatus(id, "hidden"),
      },
    });
  }

  function handleRestore(id: string) {
    setPageStatus(id, "hidden");
    toast.success("Страница восстановлена");
  }

  function handleTogglePublish(id: string) {
    const page = pages.find((p) => p.id === id);
    if (!page) return;
    const next = page.status === "published" ? "hidden" : "published";
    setPageStatus(id, next);
    toast.success(next === "published" ? "Страница опубликована" : "Страница скрыта");
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await deletePage(deleteTarget);
    setDeleteTarget(null);
    toast.success("Страница удалена");
  }

  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase tracking-tight text-foreground">
          Страницы сайта
        </h1>
        <div className="flex items-center gap-0.5 rounded-sm border border-border p-0.5">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex h-7 w-7 items-center justify-center rounded-sm transition-colors ${
              viewMode === "grid"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`flex h-7 w-7 items-center justify-center rounded-sm transition-colors ${
              viewMode === "list"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <List className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <Tabs
        value={activeSection}
        onValueChange={setActiveSection}
        className="flex-1"
      >
        <TabsList className="mb-6">
          {ADMIN_SECTIONS.map((section) => (
            <TabsTrigger key={section.id} value={section.id}>
              {section.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {ADMIN_SECTIONS.map((section) => (
          <TabsContent key={section.id} value={section.id}>
            {/* Add page — hidden in locked sections (e.g. "Уникальные") */}
            {!LOCKED_SECTIONS.has(section.id) && (
              <div className="mb-4">
                {isCreating ? (
                  <div className="flex items-center gap-2">
                    <Input
                      size="sm"
                      placeholder="Название страницы"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleCreate();
                        if (e.key === "Escape") {
                          setIsCreating(false);
                          setNewTitle("");
                        }
                      }}
                      autoFocus
                      className="max-w-xs"
                    />
                    <Button size="sm" onClick={handleCreate} disabled={!newTitle.trim()}>
                      Создать
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setIsCreating(false);
                        setNewTitle("");
                      }}
                    >
                      Отмена
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCreating(true)}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Добавить страницу
                  </Button>
                )}
              </div>
            )}

            {/* Active pages */}
            {viewMode === "grid" ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {activePages.map((page, index) => {
                  const { draggable, onDragStart, onDragOver, onDrop, onDragEnd, isDragging } =
                    dnd.itemProps(index);
                  return (
                    <div
                      key={page.id}
                      draggable={draggable}
                      onDragStart={onDragStart}
                      onDragOver={onDragOver}
                      onDrop={onDrop}
                      onDragEnd={onDragEnd}
                      className={`h-full transition-opacity ${isDragging ? "opacity-50" : ""}`}
                    >
                      <PageCard
                        page={page}
                        viewMode="grid"
                        onArchive={handleArchive}
                        onRestore={handleRestore}
                        onDelete={setDeleteTarget}
                        onTogglePublish={handleTogglePublish}
                        onGripDown={() => dnd.onGripDown(index)}
                        onGripUp={dnd.onGripUp}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="overflow-hidden rounded-sm border border-border">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border bg-muted/50 text-[length:var(--text-11)] font-medium uppercase tracking-wider text-muted-foreground">
                      <th className="py-2 pl-3 pr-1 w-8">#</th>
                      <th className="py-2 px-1 w-10"></th>
                      <th className="py-2 px-2">Название</th>
                      <th className="hidden md:table-cell py-2 px-2">Описание</th>
                      <th className="hidden lg:table-cell py-2 px-2">Обложка</th>
                      <th className="py-2 px-2">Статус</th>
                      <th className="hidden sm:table-cell py-2 px-2">Путь</th>
                      <th className="py-2 pr-3 pl-1 w-20"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {activePages.map((page, index) => {
                      const props = dnd.itemProps(index);
                      return (
                        <PageCard
                          key={page.id}
                          page={page}
                          viewMode="list"
                          onArchive={handleArchive}
                          onRestore={handleRestore}
                          onDelete={setDeleteTarget}
                          onTogglePublish={handleTogglePublish}
                          onGripDown={() => dnd.onGripDown(index)}
                          onGripUp={dnd.onGripUp}
                          dragProps={props}
                        />
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {activePages.length === 0 && (
              <p className="py-12 text-center text-[length:var(--text-14)] text-muted-foreground">
                В этом разделе пока нет страниц
              </p>
            )}

            {/* Archived pages */}
            {archivedPages.length > 0 && (
              <div className="mt-8">
                <p className="mb-3 text-[length:var(--text-12)] font-medium uppercase tracking-wider text-muted-foreground">
                  Архив ({archivedPages.length})
                </p>
                {viewMode === "grid" ? (
                  <div className="grid gap-3 opacity-60 sm:grid-cols-2 lg:grid-cols-3">
                    {archivedPages.map((page) => (
                      <PageCard
                        key={page.id}
                        page={page}
                        viewMode="grid"
                        onArchive={handleArchive}
                        onRestore={handleRestore}
                        onDelete={setDeleteTarget}
                        onTogglePublish={handleTogglePublish}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-sm border border-border opacity-60">
                    <table className="w-full text-left">
                      <tbody>
                        {archivedPages.map((page) => (
                          <PageCard
                            key={page.id}
                            page={page}
                            viewMode="list"
                            onArchive={handleArchive}
                            onRestore={handleRestore}
                            onDelete={setDeleteTarget}
                            onTogglePublish={handleTogglePublish}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Удалить страницу?"
        description="Страница будет удалена навсегда. Это действие нельзя отменить."
        confirmLabel="Удалить"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default function PagesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-rm-gray-3 border-t-foreground" />
        </div>
      }
    >
      <PagesContent />
    </Suspense>
  );
}
