"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { IconChart, IconList, IconTag, IconWallet } from "./components/icons";
import AppLogo from "../components/AppLogo";
import Home from "../page";
import { IconLogout } from "../components/icons/IconLogout";



// ── Avatar avec initiales ──
function UserAvatar({ fullName }: { fullName: string }) {
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return (
    <div className="h-9 w-9 rounded-full bg-[var(--accent)] text-white text-xs font-bold flex items-center justify-center">
      {initials}
    </div>
  );
}

// ── Menu utilisateur dropdown ──
function UserMenu({ user, onLogout }: { user: { fullName: string }; onLogout: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 rounded-full px-3 py-2 hover:bg-black/5 dark:hover:bg-white/5 transition"
      >
        <UserAvatar fullName={user.fullName} />
        <span className="hidden text-sm font-medium sm:inline">{user.fullName}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-40 rounded-xl border border-black/5 dark:border-white/10 bg-[var(--surface)] shadow-lg dark:shadow-black/30 overflow-hidden min-w-[200px]">
            <div className="px-4 py-3 border-b border-black/5 dark:border-white/10">
              <p className="text-xs text-[var(--ink-subtle)]">Connecté en tant que</p>
              <p className="text-sm font-semibold text-[var(--foreground)]">{user.fullName}</p>
            </div>
            <Link
              href="/pft/profile"
              onClick={() => setIsOpen(false)}
              className="w-full text-left px-4 py-3 text-sm text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/5 transition flex items-center gap-2"
            >
              <IconChart className="h-4 w-4" />
              Profil
            </Link>
            <button
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition flex items-center gap-2"
            >
              <IconLogout className="h-4 w-4" />
              Déconnexion
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<{ fullName: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  if (loading) return null;

  if (!user) {
    return <Home />;
  }

  const linkBase =
    "transition rounded-full px-3 py-1 text-sm hover:text-[var(--accent)]";
  const isActive = (path: string) => {
    if (path === "/pft") {
      return pathname === "/pft";
    }
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-10 border-b border-black/5 bg-[var(--surface)]/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 sm:px-10 lg:px-16">
          <Link className="flex items-center gap-3" href="/pft">
            <AppLogo className="h-9 w-9" />
            <span className="text-sm font-semibold hidden sm:inline">PFT</span>
          </Link>
          <div className="hidden items-center gap-2 text-[var(--ink-subtle)] md:flex">
            <Link
              className={`${linkBase} ${
                isActive("/pft")
                  ? "bg-[#f3efe6] dark:bg-white/10 text-[var(--accent)]"
                  : ""
              }`}
              href="/pft"
            >
              <span className="inline-flex items-center gap-2">
                <IconChart className="h-4 w-4" />
                Dashboard
              </span>
            </Link>
            <Link
              className={`${linkBase} ${
                isActive("/pft/accounts")
                  ? "bg-[#f3efe6] dark:bg-white/10 text-[var(--accent)]"
                  : ""
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
                isActive("/pft/transactions")
                  ? "bg-[#f3efe6] dark:bg-white/10 text-[var(--accent)]"
                  : ""
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
                isActive("/pft/categories")
                  ? "bg-[#f3efe6] dark:bg-white/10 text-[var(--accent)]"
                  : ""
              }`}
              href="/pft/categories"
            >
              <span className="inline-flex items-center gap-2">
                <IconTag className="h-4 w-4" />
                Categories
              </span>
            </Link>
            {/* Separator + User Menu */}
            <span className="mx-1 h-5 w-px bg-black/10 dark:bg-white/10" />
            <UserMenu user={user} onLogout={handleLogout} />
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
                  isActive("/pft")
                    ? "bg-[#f3efe6] dark:bg-white/10 text-[var(--accent)]"
                    : ""
                }`}
                href="/pft"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="inline-flex items-center gap-2">
                  <IconChart className="h-4 w-4" />
                  Dashboard
                </span>
              </Link>
              <Link
                className={`${linkBase} ${
                  isActive("/pft/accounts")
                    ? "bg-[#f3efe6] dark:bg-white/10 text-[var(--accent)]"
                    : ""
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
                  isActive("/pft/transactions")
                    ? "bg-[#f3efe6] dark:bg-white/10 text-[var(--accent)]"
                    : ""
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
                  isActive("/pft/categories")
                    ? "bg-[#f3efe6] dark:bg-white/10 text-[var(--accent)]"
                    : ""
                }`}
                href="/pft/categories"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="inline-flex items-center gap-2">
                  <IconTag className="h-4 w-4" />
                  Categories
                </span>
              </Link>
              {/* Separator + User Menu */}
              <div className="my-1 h-px bg-black/5 dark:bg-white/10" />
              <div onClick={() => setIsMenuOpen(false)}>
                <UserMenu user={user} onLogout={handleLogout} />
              </div>
            </div>
          </div>
        ) : null}
      </nav>
      {children}
    </div>
  );
}
