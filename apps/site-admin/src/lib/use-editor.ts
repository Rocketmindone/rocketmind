"use client";

import { useCallback, useReducer } from "react";
import type { SitePage, PageBlock } from "./types";

const MAX_HISTORY = 50;

// ── State ───────────────────────────────────────────────────────────────────

interface EditorState {
  original: SitePage;
  past: SitePage[];
  present: SitePage;
  future: SitePage[];
}

// ── Actions ─────────────────────────────────────────────────────────────────

type EditorAction =
  | { type: "SET_PAGE"; page: SitePage }
  | { type: "UPDATE_META"; field: string; value: unknown }
  | { type: "UPDATE_BLOCK"; blockId: string; data: Record<string, unknown> }
  | { type: "TOGGLE_BLOCK"; blockId: string }
  | { type: "REORDER_BLOCKS"; orderedIds: string[] }
  | { type: "UPDATE_STATUS"; status: SitePage["status"] }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "SAVE"; page: SitePage }
  | { type: "DISCARD" };

// ── Reducer ─────────────────────────────────────────────────────────────────

function pushHistory(state: EditorState, next: SitePage): EditorState {
  return {
    ...state,
    past: [...state.past, state.present].slice(-MAX_HISTORY),
    present: next,
    future: [],
  };
}

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "SET_PAGE":
      return {
        original: action.page,
        past: [],
        present: action.page,
        future: [],
      };

    case "UPDATE_META": {
      const next = { ...state.present, [action.field]: action.value };
      return pushHistory(state, next);
    }

    case "UPDATE_BLOCK": {
      const next = {
        ...state.present,
        blocks: state.present.blocks.map((b) =>
          b.id === action.blockId ? { ...b, data: { ...b.data, ...action.data } } : b
        ),
      };
      return pushHistory(state, next);
    }

    case "TOGGLE_BLOCK": {
      const next = {
        ...state.present,
        blocks: state.present.blocks.map((b) =>
          b.id === action.blockId ? { ...b, enabled: !b.enabled } : b
        ),
      };
      return pushHistory(state, next);
    }

    case "REORDER_BLOCKS": {
      const blockMap = new Map(state.present.blocks.map((b) => [b.id, b]));
      const reordered = action.orderedIds
        .map((id, index) => {
          const block = blockMap.get(id);
          return block ? { ...block, order: index } : null;
        })
        .filter(Boolean) as PageBlock[];
      const next = { ...state.present, blocks: reordered };
      return pushHistory(state, next);
    }

    case "UPDATE_STATUS": {
      const next = { ...state.present, status: action.status };
      return pushHistory(state, next);
    }

    case "UNDO": {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      return {
        ...state,
        past: state.past.slice(0, -1),
        present: previous,
        future: [state.present, ...state.future],
      };
    }

    case "REDO": {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      return {
        ...state,
        past: [...state.past, state.present],
        present: next,
        future: state.future.slice(1),
      };
    }

    case "SAVE":
      return {
        ...state,
        original: action.page,
        present: action.page,
        past: [],
        future: [],
      };

    case "DISCARD":
      return {
        ...state,
        past: [],
        present: state.original,
        future: [],
      };

    default:
      return state;
  }
}

// ── Hook ────────────────────────────────────────────────────────────────────

function createInitialState(page: SitePage): EditorState {
  return {
    original: page,
    past: [],
    present: page,
    future: [],
  };
}

export function useEditor(page: SitePage) {
  const [state, dispatch] = useReducer(editorReducer, page, createInitialState);

  const isDirty = state.present !== state.original;
  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const updateMeta = useCallback(
    (field: string, value: unknown) =>
      dispatch({ type: "UPDATE_META", field, value }),
    []
  );

  const updateBlock = useCallback(
    (blockId: string, data: Record<string, unknown>) =>
      dispatch({ type: "UPDATE_BLOCK", blockId, data }),
    []
  );

  const toggleBlock = useCallback(
    (blockId: string) => dispatch({ type: "TOGGLE_BLOCK", blockId }),
    []
  );

  const reorderBlocks = useCallback(
    (orderedIds: string[]) =>
      dispatch({ type: "REORDER_BLOCKS", orderedIds }),
    []
  );

  const updateStatus = useCallback(
    (status: SitePage["status"]) =>
      dispatch({ type: "UPDATE_STATUS", status }),
    []
  );

  const undo = useCallback(() => dispatch({ type: "UNDO" }), []);
  const redo = useCallback(() => dispatch({ type: "REDO" }), []);

  const markSaved = useCallback(
    (savedPage: SitePage) => dispatch({ type: "SAVE", page: savedPage }),
    []
  );

  const discard = useCallback(() => dispatch({ type: "DISCARD" }), []);

  return {
    page: state.present,
    original: state.original,
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
  };
}
