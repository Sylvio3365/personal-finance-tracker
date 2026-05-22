"use client";

import { useState, useRef } from "react";

interface CustomSelectProps {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
}

/**
 * Select réutilisable avec menu déroulant personnalisé (pas de <select> natif).
 */
export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Sélectionner...",
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedLabel =
    options.find((o) => o.value === value)?.label || placeholder;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="h-11 w-full rounded-2xl border border-[var(--accent)]/30 bg-white dark:bg-[#121415] text-[var(--foreground)] px-4 pr-10 text-sm outline-none transition-all duration-200 hover:border-[var(--accent)]/60 hover:bg-[var(--accent)]/5 dark:hover:bg-[var(--accent)]/10 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 cursor-pointer text-left flex items-center justify-between"
      >
        <span
          className={`truncate ${!value ? "text-[var(--ink-subtle)]" : ""}`}
        >
          {selectedLabel}
        </span>
        <svg
          className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--ink-subtle)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <ul className="absolute z-50 mt-1.5 max-h-56 w-full overflow-auto rounded-2xl border border-[var(--accent)]/20 bg-white dark:bg-[#1a1d1e] shadow-lg shadow-black/5 dark:shadow-black/30 py-1 text-sm">
            {options.map((opt) => {
              const selected = opt.value === value;
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-4 py-2 transition-colors ${
                      selected
                        ? "bg-[var(--accent)]/10 text-[var(--accent)] font-medium"
                        : "text-[var(--foreground)] hover:bg-[var(--accent)]/5 dark:hover:bg-white/5"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {selected && (
                      <svg
                        className="h-4 w-4 text-[var(--accent)]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
