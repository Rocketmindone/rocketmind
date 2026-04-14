"use client";

import { useRef, useState, useEffect } from "react";
import { SiteFooter } from "@rocketmind/ui";
import { FloatingMascot } from "@/components/blocks/FloatingMascot";
import { AiConsultant, type AiConsultantHandle } from "./AiConsultant";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function Footer() {
  const chatRef = useRef<AiConsultantHandle>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [sectionVisible, setSectionVisible] = useState(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setSectionVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <FloatingMascot
        onScrollToChat={() => chatRef.current?.scrollIntoView()}
        hidden={sectionVisible}
      />
      <div ref={sentinelRef}>
        <SiteFooter basePath={BASE_PATH}>
          <AiConsultant ref={chatRef} />
        </SiteFooter>
      </div>
    </>
  );
}
