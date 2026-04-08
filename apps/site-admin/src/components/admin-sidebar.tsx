"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut, FileText } from "lucide-react";
import { Button, ScrollArea, Separator } from "@rocketmind/ui";
import { ADMIN_SECTIONS } from "@/lib/constants";
import { useAuth } from "@/lib/auth-context";

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="flex h-full w-[280px] shrink-0 flex-col border-r border-border bg-background">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-foreground">
          <FileText className="h-4 w-4 text-background" />
        </div>
        <div>
          <p className="text-[length:var(--text-14)] font-semibold text-foreground">
            CMS
          </p>
          <p className="text-[length:var(--text-10)] text-muted-foreground">
            Rocketmind
          </p>
        </div>
      </div>

      <Separator />

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-2">
          <p className="px-2 py-2 text-[length:var(--text-10)] font-medium uppercase tracking-wider text-muted-foreground">
            Разделы сайта
          </p>
          {ADMIN_SECTIONS.map((section) => {
            const isActive = pathname === "/pages" || pathname?.includes(section.id);
            return (
              <Link
                key={section.id}
                href={`/pages?section=${section.id}`}
                className={`flex items-center gap-2 rounded-sm px-3 py-2 text-[length:var(--text-14)] transition-colors ${
                  isActive
                    ? "bg-rm-gray-1 text-foreground"
                    : "text-muted-foreground hover:bg-rm-gray-1 hover:text-foreground"
                }`}
              >
                {section.label}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <Separator />

      {/* Footer */}
      <div className="p-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Выйти
        </Button>
      </div>
    </div>
  );
}
