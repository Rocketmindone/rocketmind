"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** Instantly scrolls to top on every route change. */
export function ScrollToTop() {
  const pathname = usePathname();
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
