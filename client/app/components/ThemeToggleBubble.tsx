"use client";

import { useEffect, useState } from "react";

export default function ThemeToggleBubble() {
  const [isMounted, setIsMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = window.localStorage.getItem("pft-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = stored ? stored === "dark" : prefersDark;
    setIsDark(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("pft-theme", next ? "dark" : "light");
  };

  if (!isMounted) return null;

  return (
    <div className="group fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Tooltip badge */}
      <span className="pointer-events-none select-none rounded-xl border border-black/5 dark:border-white/10 bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--foreground)] opacity-0 shadow-md transition-all duration-300 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 md:block hidden">
        {isDark ? "Mode clair" : "Mode sombre"}
      </span>

      {/* Floating Action Button (FAB) */}
      <button
        type="button"
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className={`relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full transition-all duration-300 hover:scale-110 active:scale-95 shadow-[0_8px_30px_rgb(0,0,0,0.15)] ${isDark
          ? "bg-gradient-to-tr from-[#1e293b] to-[#334155] border border-white/15 hover:shadow-[0_8px_30px_rgba(109,186,156,0.25)]"
          : "bg-gradient-to-tr from-amber-400 to-yellow-300 hover:shadow-[0_8px_30px_rgba(245,158,11,0.4)]"
          }`}
      >
        {/* Glow effect for light mode */}
        {!isDark && (
          <span className="absolute inset-0 animate-ping rounded-full bg-yellow-400/20 opacity-75 duration-1000" />
        )}

        <svg
          viewBox="0 0 24 24"
          className={`h-7 w-7 transition-all duration-500 ${isDark ? "text-emerald-300 rotate-0" : "text-amber-950 scale-110 rotate-12"
            }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Bulb Outline & Filament */}
          <path
            d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .6 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"
            className="transition-all duration-500"
            fill={isDark ? "none" : "rgba(253, 224, 71, 0.4)"}
          />
          <path d="M9 18h6" />
          <path d="M10 22h4" />

          {/* Filament detail */}
          {!isDark && (
            <path
              d="M10 10l2-2 2 2"
              strokeWidth="1.5"
              className="text-amber-800"
            />
          )}

          {/* Sun/Light Rays around the bulb (only in Light mode) */}
          {!isDark && (
            <>
              <line x1="12" y1="2" x2="12" y2="3" strokeWidth="2.5" />
              <line x1="12" y1="15" x2="12" y2="16" strokeWidth="2.5" />
              <line x1="5" y1="8" x2="4" y2="8" strokeWidth="2.5" />
              <line x1="20" y1="8" x2="19" y2="8" strokeWidth="2.5" />
              <line x1="7" y1="3.5" x2="7.7" y2="4.2" strokeWidth="2.5" />
              <line x1="16.3" y1="11.8" x2="17" y2="12.5" strokeWidth="2.5" />
              <line x1="17" y1="3.5" x2="16.3" y2="4.2" strokeWidth="2.5" />
              <line x1="7.7" y1="11.8" x2="7" y2="12.5" strokeWidth="2.5" />
            </>
          )}
        </svg>

        {/* Screen reader text */}
        <span className="sr-only">
          {isDark ? "Activer le mode clair" : "Activer le mode sombre"}
        </span>
      </button>
    </div>
  );
}
