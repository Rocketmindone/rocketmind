"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import React from "react";
import type { SitePage, PageStatus } from "./types";

// ── Context ─────────────────────────────────────────────────────────────────

interface StoreContext {
  pages: SitePage[];
  loading: boolean;
  getPagesBySection(sectionId: string): SitePage[];
  getPage(pageId: string): SitePage | undefined;
  createPage(sectionId: string, title: string): Promise<SitePage | null>;
  setPageStatus(pageId: string, status: PageStatus): void;
  deletePage(pageId: string): Promise<void>;
  savePage(page: SitePage): Promise<void>;
  reload(): Promise<void>;
}

const AdminStoreContext = createContext<StoreContext | null>(null);

export function AdminStoreProvider({ children }: { children: ReactNode }) {
  const [pages, setPages] = useState<SitePage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPages = useCallback(async () => {
    try {
      const res = await fetch("/api/pages");
      const data = await res.json();
      setPages(data as SitePage[]);
    } catch (e) {
      console.error("Failed to load pages:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const getPagesBySection = useCallback(
    (sectionId: string) =>
      pages
        .filter((p) => p.sectionId === sectionId)
        .sort((a, b) => a.order - b.order),
    [pages]
  );

  const getPage = useCallback(
    (pageId: string) => pages.find((p) => p.id === pageId),
    [pages]
  );

  const createPage = useCallback(
    async (sectionId: string, title: string): Promise<SitePage | null> => {
      const slug = title
        .toLowerCase()
        .replace(/[^a-zа-яё0-9\s-]/gi, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .substring(0, 50);

      try {
        const res = await fetch("/api/pages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sectionId, slug, menuTitle: title }),
        });
        if (!res.ok) return null;
        const page = (await res.json()) as SitePage;
        setPages((prev) => [...prev, page]);
        return page;
      } catch {
        return null;
      }
    },
    []
  );

  const setPageStatus = useCallback(
    (pageId: string, status: PageStatus) => {
      // Status is local-only for now (not persisted to MD)
      setPages((prev) =>
        prev.map((p) => (p.id === pageId ? { ...p, status } : p))
      );
    },
    []
  );

  const deletePage = useCallback(async (pageId: string) => {
    try {
      const res = await fetch(`/api/pages/${encodeURIComponent(pageId)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPages((prev) => prev.filter((p) => p.id !== pageId));
      }
    } catch {
      // ignore
    }
  }, []);

  const savePage = useCallback(async (page: SitePage) => {
    try {
      await fetch(`/api/pages/${encodeURIComponent(page.id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(page),
      });
      setPages((prev) =>
        prev.map((p) =>
          p.id === page.id ? { ...page, updatedAt: new Date().toISOString() } : p
        )
      );
    } catch {
      // ignore
    }
  }, []);

  if (loading) {
    return React.createElement(
      "div",
      { className: "flex min-h-dvh items-center justify-center" },
      React.createElement("div", {
        className:
          "h-6 w-6 animate-spin rounded-full border-2 border-rm-gray-3 border-t-foreground",
      })
    );
  }

  return React.createElement(
    AdminStoreContext.Provider,
    {
      value: {
        pages,
        loading,
        getPagesBySection,
        getPage,
        createPage,
        setPageStatus,
        deletePage,
        savePage,
        reload: fetchPages,
      },
    },
    children
  );
}

export function useAdminStore() {
  const ctx = useContext(AdminStoreContext);
  if (!ctx)
    throw new Error("useAdminStore must be used within AdminStoreProvider");
  return ctx;
}
