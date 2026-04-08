"use client";

import { LogOut, FileText } from "lucide-react";
import { Button } from "@rocketmind/ui";
import { useAuth } from "@/lib/auth-context";

export function AdminHeader() {
  const { logout } = useAuth();

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-background px-6">
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-foreground">
          <FileText className="h-3 w-3 text-background" />
        </div>
        <span className="text-[length:var(--text-14)] font-semibold text-foreground">
          CMS
        </span>
        <span className="text-[length:var(--text-12)] text-muted-foreground">
          Rocketmind
        </span>
      </div>

      <Button
        variant="ghost"
        size="xs"
        className="gap-1.5 text-muted-foreground"
        onClick={logout}
      >
        <LogOut className="h-3.5 w-3.5" />
        Выйти
      </Button>
    </header>
  );
}
