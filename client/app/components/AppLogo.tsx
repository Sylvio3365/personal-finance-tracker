"use client";

export default function AppLogo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl bg-gradient-to-tr from-[var(--accent)] to-[#156e58] p-2 shadow-md shadow-[var(--accent)]/10 dark:shadow-none transition hover:brightness-105 duration-300 ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-full w-full text-white"
      >
        {/* Dynamic layered diamond/sheet showing ascending growth tiers */}
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    </div>
  );
}
