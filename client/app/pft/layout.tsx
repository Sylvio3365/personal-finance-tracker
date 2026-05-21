"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IconChart, IconList, IconTag, IconWallet } from "./components/icons";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const linkBase =
    "transition rounded-full px-3 py-1 text-sm hover:text-[var(--accent)]";
  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  useEffect(() => {
    const stored = window.localStorage.getItem("pft-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = stored ? stored === "dark" : prefersDark;
    setIsDark(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      window.localStorage.setItem("pft-theme", next ? "dark" : "light");
      return next;
    });
  };

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-10 border-b border-black/5 bg-[var(--surface)]/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 sm:px-10 lg:px-16">
          <Link className="flex items-center gap-3" href="/pft">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-semibold text-white">
              PFT
            </span>
            <span className="text-sm font-semibold">Tableau de bord</span>
          </Link>
          <div className="hidden items-center gap-2 text-[var(--ink-subtle)] md:flex">
            <Link
              className={`${linkBase} ${
                isActive("/pft/accounts") ? "bg-[#f3efe6] text-[var(--accent)]" : ""
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
                isActive("/pft/transactions") ? "bg-[#f3efe6] text-[var(--accent)]" : ""
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
                isActive("/pft/categories") ? "bg-[#f3efe6] text-[var(--accent)]" : ""
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
                isActive("/pft/reports") ? "bg-[#f3efe6] text-[var(--accent)]" : ""
              }`}
              href="/pft/reports"
            >
              <span className="inline-flex items-center gap-2">
                <IconChart className="h-4 w-4" />
                Rapports
              </span>
            </Link>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="hidden items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-xs font-semibold text-[var(--ink-subtle)] transition hover:border-[var(--accent)] md:inline-flex"
          >
            {isDark ? "Mode clair" : "Mode sombre"}
          </button>
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
                  isActive("/pft/accounts") ? "bg-[#f3efe6] text-[var(--accent)]" : ""
                }`}
                href="/pft/accounts"
                onClick={() => setIsMenuOpen(false)}
              >
                Comptes
              </Link>
              <Link
                className={`${linkBase} ${
                  isActive("/pft/transactions") ? "bg-[#f3efe6] text-[var(--accent)]" : ""
                }`}
                href="/pft/transactions"
                onClick={() => setIsMenuOpen(false)}
              >
                Transactions
              </Link>
              <Link
                className={`${linkBase} ${
                  isActive("/pft/categories") ? "bg-[#f3efe6] text-[var(--accent)]" : ""
                }`}
                href="/pft/categories"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                className={`${linkBase} ${
                  isActive("/pft/reports") ? "bg-[#f3efe6] text-[var(--accent)]" : ""
                }`}
                href="/pft/reports"
                onClick={() => setIsMenuOpen(false)}
              >
                Rapports
              </Link>
              <button
                type="button"
                onClick={toggleTheme}
                className="mt-2 inline-flex items-center justify-center rounded-full border border-black/10 px-4 py-2 text-xs font-semibold text-[var(--ink-subtle)] transition hover:border-[var(--accent)]"
              >
                {isDark ? "Mode clair" : "Mode sombre"}
              </button>
            </div>
          </div>
        ) : null}
      </nav>
      {children}
    </div>
  );
}
