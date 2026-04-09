"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, FileText, Users } from "lucide-react";
import { Button } from "@rocketmind/ui";
import { useAuth } from "@/lib/auth-context";

export function AdminHeader() {
  const { logout } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { href: "/pages", label: "Страницы", icon: FileText },
    { href: "/experts", label: "Эксперты", icon: Users },
  ];

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-background px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-foreground">
            <FileText className="h-3 w-3 text-background" />
          </div>
          <span className="text-[length:var(--text-14)] font-semibold text-foreground">
            CMS
          </span>
        </div>

        <nav className="flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-[length:var(--text-12)] font-medium transition-colors ${
                  isActive
                    ? "bg-foreground/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            );
          })}
        </nav>
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
