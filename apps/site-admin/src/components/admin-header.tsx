"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, FileText, Users } from "lucide-react";
import { Button } from "@rocketmind/ui";
import { useAuth } from "@/lib/auth-context";
import { useNavigationGuard } from "@/lib/navigation-guard";
import { useAdminStore } from "@/lib/store";
import { ADMIN_SECTIONS } from "@/lib/constants";

export function AdminHeader() {
  const { logout } = useAuth();
  const pathname = usePathname();
  const { tryNavigate } = useNavigationGuard();
  const { getPage } = useAdminStore();

  // Detect page editor: /pages/{encodedPageId}
  const pageMatch = pathname.match(/^\/pages\/(.+)$/);
  const editingPage = pageMatch
    ? getPage(decodeURIComponent(pageMatch[1]))
    : null;
  const editingSection = editingPage
    ? ADMIN_SECTIONS.find((s) => s.id === editingPage.sectionId)
    : null;

  const isOnPages = pathname.startsWith("/pages");
  const isOnExperts = pathname.startsWith("/experts");

  function guardedClick(e: React.MouseEvent, href: string) {
    if (!tryNavigate(href)) e.preventDefault();
  }

  const linkBase =
    "rounded-sm px-2.5 py-1 text-[length:var(--text-12)] font-medium transition-colors";
  const linkIdle = "text-muted-foreground hover:text-foreground";
  const linkActive = "bg-foreground/10 text-foreground";

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-background px-6">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-foreground">
            <FileText className="h-3 w-3 text-background" />
          </div>
          <span className="text-[length:var(--text-14)] font-semibold text-foreground">
            CMS
          </span>
        </div>

        <nav className="flex items-center gap-1">
          {/* ── Pages tab / breadcrumb ─────────────────────────── */}
          {editingPage ? (
            <div className="flex items-center">
              <Link
                href="/pages"
                onClick={(e) => guardedClick(e, "/pages")}
                className={`flex items-center gap-1.5 ${linkBase} ${linkIdle}`}
              >
                <FileText className="h-3.5 w-3.5" />
                Страницы
              </Link>
              <span className="text-[length:var(--text-12)] text-muted-foreground/40 select-none">
                /
              </span>
              {editingSection && (
                <>
                  <Link
                    href={`/pages?section=${editingSection.id}`}
                    onClick={(e) =>
                      guardedClick(e, `/pages?section=${editingSection.id}`)
                    }
                    className={`${linkBase} ${linkIdle}`}
                  >
                    {editingSection.label}
                  </Link>
                  <span className="text-[length:var(--text-12)] text-muted-foreground/40 select-none">
                    /
                  </span>
                </>
              )}
              <span className={`${linkBase} ${linkActive}`}>
                {editingPage.menuTitle}
              </span>
            </div>
          ) : (
            <Link
              href="/pages"
              onClick={(e) => guardedClick(e, "/pages")}
              className={`flex items-center gap-1.5 ${linkBase} ${isOnPages ? linkActive : linkIdle}`}
            >
              <FileText className="h-3.5 w-3.5" />
              Страницы
            </Link>
          )}

          {/* ── Experts tab ────────────────────────────────────── */}
          <Link
            href="/experts"
            onClick={(e) => guardedClick(e, "/experts")}
            className={`flex items-center gap-1.5 ${linkBase} ${isOnExperts ? linkActive : linkIdle}`}
          >
            <Users className="h-3.5 w-3.5" />
            Эксперты
          </Link>
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
