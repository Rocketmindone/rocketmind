"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Redirect to unified login page — code step is handled inline now */
export default function LoginCodeRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/login");
  }, [router]);
  return null;
}
