import type { ReactNode } from "react";
import Link from "next/link";
import { FileText, Images, LayoutDashboard, LogOut, Settings, Users } from "lucide-react";
import { NavLink } from "./NavLink";
import { ThemeToggle } from "./ThemeToggle";
import { Separator } from "./ui/card";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/admin/dashboard" className={`flex items-center gap-2 ${className}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand text-[13px] font-black tracking-tight text-[#0a0a0a]">
        G
      </span>
      <span className="text-[15px] font-semibold tracking-tight">
        GOAT <span className="text-muted-foreground">admin</span>
      </span>
    </Link>
  );
}

function Sidebar({ username }: { username: string }) {
  return (
    <aside className="sticky top-0 flex h-dvh w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground max-lg:hidden">
      <div className="px-4 py-5">
        <Logo />
      </div>

      <Separator className="bg-sidebar-border" />

      <nav className="flex flex-col gap-1 p-3">
        <NavLink href="/admin/dashboard" icon={<LayoutDashboard className="h-4 w-4" />}>
          Dashboard
        </NavLink>
        <NavLink href="/admin/content" icon={<FileText className="h-4 w-4" />}>
          Контент
        </NavLink>
        <NavLink href="/admin/media" icon={<Images className="h-4 w-4" />}>
          Медиа
        </NavLink>
        <NavLink href="/admin/users" icon={<Users className="h-4 w-4" />}>
          Пользователи
        </NavLink>
        <NavLink href="/admin/settings" icon={<Settings className="h-4 w-4" />}>
          Настройки
        </NavLink>
      </nav>

      <div className="mt-auto flex flex-col gap-1 p-3">
        <Separator className="mb-2 bg-sidebar-border" />
        <div className="truncate px-3 py-1 text-xs text-muted-foreground" title={username}>
          {username}
        </div>
        <ThemeToggle />
        <NavLink href="/admin/logout" icon={<LogOut className="h-4 w-4" />} prefetch={false}>
          Выйти
        </NavLink>
      </div>
    </aside>
  );
}

function MobileBar() {
  return (
    <div className="flex items-center justify-between border-b border-sidebar-border bg-sidebar px-4 py-3 lg:hidden">
      <Logo />
      <nav className="flex items-center gap-1 text-sm">
        <Link href="/admin/content" className="rounded-md px-2 py-1 hover:bg-sidebar-accent">
          Контент
        </Link>
        <Link href="/admin/media" className="rounded-md px-2 py-1 hover:bg-sidebar-accent">
          Медиа
        </Link>
        <Link href="/admin/settings" className="rounded-md px-2 py-1 hover:bg-sidebar-accent">
          Ещё
        </Link>
      </nav>
    </div>
  );
}

export function AdminShell({ children, username }: { children: ReactNode; username: string }) {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground lg:flex-row">
      <Sidebar username={username} />
      <MobileBar />
      <main className="flex min-w-0 flex-1 flex-col">{children}</main>
    </div>
  );
}

export function TopBar({ title, actions }: { title: string; actions?: ReactNode }) {
  return (
    <header className="sticky top-0 z-20 flex min-h-14 flex-wrap items-center justify-between gap-3 border-b bg-background/80 px-6 py-2 backdrop-blur">
      <h1 className="text-base font-semibold tracking-tight">{title}</h1>
      <div className="flex items-center gap-3">{actions}</div>
    </header>
  );
}
