"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { IconChart, IconList, IconTag, IconWallet } from "./components/icons";
import AppLogo from "../components/AppLogo";

function IconLogout({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const linkBase =
    "transition rounded-full px-3 py-1 text-sm hover:text-[var(--accent)]";
  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-10 border-b border-black/5 bg-[var(--surface)]/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 sm:px-10 lg:px-16">
          <Link className="flex items-center gap-3" href="/pft">
            <AppLogo className="h-9 w-9" />
            <span className="text-sm font-semibold">Tableau de bord</span>
          </Link>
          <div className="hidden items-center gap-2 text-[var(--ink-subtle)] md:flex">
            <Link
              className={`${linkBase} ${
                isActive("/pft/accounts") ? "bg-[#f3efe6] dark:bg-white/10 text-[var(--accent)]" : ""
              }`}
              href="/pft/accounts"
            >
              <span className="inline-flex items-center gap-2">
                <IconWallet className="h-4 w-4" />
                Comptes
              </span>
            </Link>
            <Link
              className={`${linkBase} ${
                isActive("/pft/transactions") ? "bg-[#f3efe6] dark:bg-white/10 text-[var(--accent)]" : ""
              }`}
              href="/pft/transactions"
            >
              <span className="inline-flex items-center gap-2">
                <IconList className="h-4 w-4" />
                Transactions
              </span>
            </Link>
            <Link
              className={`${linkBase} ${
                isActive("/pft/categories") ? "bg-[#f3efe6] dark:bg-white/10 text-[var(--accent)]" : ""
              }`}
              href="/pft/categories"
            >
              <span className="inline-flex items-center gap-2">
                <IconTag className="h-4 w-4" />
                Categories
              </span>
            </Link>
            <Link
              className={`${linkBase} ${
                isActive("/pft/reports") ? "bg-[#f3efe6] dark:bg-white/10 text-[var(--accent)]" : ""
              }`}
              href="/pft/reports"
            >
              <span className="inline-flex items-center gap-2">
                <IconChart className="h-4 w-4" />
                Rapports
              </span>
            </Link>
            {/* Separator + Logout */}
            <span className="mx-1 h-5 w-px bg-black/10 dark:bg-white/10" />
            <Link
              className="transition rounded-full px-3 py-1 text-sm text-red-400 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300"
              href="/"
            >
              <span className="inline-flex items-center gap-2">
                <IconLogout className="h-4 w-4" />
                Deconnexion
              </span>
            </Link>
          </div>
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="inline-flex items-center rounded-full border border-black/10 px-4 py-2 text-xs font-semibold text-[var(--ink-subtle)] transition hover:border-[var(--accent)] md:hidden"
          >
            {isMenuOpen ? "Fermer" : "Menu"}
          </button>
        </div>
        {isMenuOpen ? (
          <div className="border-t border-black/5 bg-[var(--surface)] px-6 py-4 sm:px-10 md:hidden">
            <div className="grid gap-2">
              <Link
                className={`${linkBase} ${
                  isActive("/pft/accounts") ? "bg-[#f3efe6] dark:bg-white/10 text-[var(--accent)]" : ""
                }`}
                href="/pft/accounts"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="inline-flex items-center gap-2">
                  <IconWallet className="h-4 w-4" />
                  Comptes
                </span>
              </Link>
              <Link
                className={`${linkBase} ${
                  isActive("/pft/transactions") ? "bg-[#f3efe6] dark:bg-white/10 text-[var(--accent)]" : ""
                }`}
                href="/pft/transactions"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="inline-flex items-center gap-2">
                  <IconList className="h-4 w-4" />
                  Transactions
                </span>
              </Link>
              <Link
                className={`${linkBase} ${
                  isActive("/pft/categories") ? "bg-[#f3efe6] dark:bg-white/10 text-[var(--accent)]" : ""
                }`}
                href="/pft/categories"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="inline-flex items-center gap-2">
                  <IconTag className="h-4 w-4" />
                  Categories
                </span>
              </Link>
              <Link
                className={`${linkBase} ${
                  isActive("/pft/reports") ? "bg-[#f3efe6] dark:bg-white/10 text-[var(--accent)]" : ""
                }`}
                href="/pft/reports"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="inline-flex items-center gap-2">
                  <IconChart className="h-4 w-4" />
                  Rapports
                </span>
              </Link>
              {/* Separator + Logout */}
              <div className="my-1 h-px bg-black/5 dark:bg-white/10" />
              <Link
                className="transition rounded-full px-3 py-1 text-sm text-red-400 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300"
                href="/"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="inline-flex items-center gap-2">
                  <IconLogout className="h-4 w-4" />
                  Deconnexion
                </span>
              </Link>
            </div>
          </div>
        ) : null}
      </nav>
      {children}
    </div>
  );
}
