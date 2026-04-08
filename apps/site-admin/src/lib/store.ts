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
import type { AdminStore, SitePage, PageStatus, PageBlock, BlockType } from "./types";
import { createSeedStore } from "./seed-data";
import { DEFAULT_BLOCK_TYPES } from "./constants";

const STORE_KEY = "rm_site_admin";

function loadStore(): AdminStore {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      return JSON.parse(raw) as AdminStore;
    }
  } catch {
    // ignore
  }
  const seed = createSeedStore();
  localStorage.setItem(STORE_KEY, JSON.stringify(seed));
  return seed;
}

function saveStore(store: AdminStore) {
  const updated = { ...store, lastSaved: new Date().toISOString() };
  localStorage.setItem(STORE_KEY, JSON.stringify(updated));
  return updated;
}

// ── Context ─────────────────────────────────────────────────────────────────

interface StoreContext {
  store: AdminStore;
  getPagesBySection(sectionId: string): SitePage[];
  getPage(pageId: string): SitePage | undefined;
  createPage(sectionId: string, title: string): SitePage;
  updatePage(pageId: string, updates: Partial<SitePage>): void;
  setPageStatus(pageId: string, status: PageStatus): void;
  deletePage(pageId: string): void;
  savePage(page: SitePage): void;
}

const AdminStoreContext = createContext<StoreContext | null>(null);

export function AdminStoreProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<AdminStore>(() => ({
    version: 1,
    pages: [],
    lastSaved: new Date().toISOString(),
  }));
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setStore(loadStore());
    setLoaded(true);
  }, []);

  const persist = useCallback((updater: (prev: AdminStore) => AdminStore) => {
    setStore((prev) => {
      const next = updater(prev);
      return saveStore(next);
    });
  }, []);

  const getPagesBySection = useCallback(
    (sectionId: string) =>
      store.pages
        .filter((p) => p.sectionId === sectionId)
        .sort((a, b) => a.order - b.order),
    [store.pages]
  );

  const getPage = useCallback(
    (pageId: string) => store.pages.find((p) => p.id === pageId),
    [store.pages]
  );

  const createPage = useCallback(
    (sectionId: string, title: string): SitePage => {
      const now = new Date().toISOString();
      const sectionPages = store.pages.filter((p) => p.sectionId === sectionId);
      const slug = `new-page-${Date.now()}`;

      let blockIdCounter = 0;
      const blocks: PageBlock[] = DEFAULT_BLOCK_TYPES.map((type: BlockType, index: number) => ({
        id: `b_${Date.now()}_${++blockIdCounter}`,
        type,
        enabled: true,
        order: index,
        data: {},
      }));

      const page: SitePage = {
        id: `p_${Date.now()}`,
        sectionId,
        slug,
        status: "hidden",
        order: sectionPages.length,
        menuTitle: title,
        menuDescription: "",
        cardTitle: title,
        cardDescription: "",
        metaTitle: `${title} — Rocketmind`,
        metaDescription: "",
        blocks,
        createdAt: now,
        updatedAt: now,
      };

      persist((prev) => ({
        ...prev,
        pages: [...prev.pages, page],
      }));

      return page;
    },
    [store.pages, persist]
  );

  const updatePage = useCallback(
    (pageId: string, updates: Partial<SitePage>) => {
      persist((prev) => ({
        ...prev,
        pages: prev.pages.map((p) =>
          p.id === pageId
            ? { ...p, ...updates, updatedAt: new Date().toISOString() }
            : p
        ),
      }));
    },
    [persist]
  );

  const setPageStatus = useCallback(
    (pageId: string, status: PageStatus) => {
      updatePage(pageId, { status });
    },
    [updatePage]
  );

  const deletePage = useCallback(
    (pageId: string) => {
      persist((prev) => ({
        ...prev,
        pages: prev.pages.filter((p) => p.id !== pageId),
      }));
    },
    [persist]
  );

  const savePage = useCallback(
    (page: SitePage) => {
      persist((prev) => ({
        ...prev,
        pages: prev.pages.map((p) =>
          p.id === page.id
            ? { ...page, updatedAt: new Date().toISOString() }
            : p
        ),
      }));
    },
    [persist]
  );

  if (!loaded) return null;

  return React.createElement(
    AdminStoreContext.Provider,
    {
      value: {
        store,
        getPagesBySection,
        getPage,
        createPage,
        updatePage,
        setPageStatus,
        deletePage,
        savePage,
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
