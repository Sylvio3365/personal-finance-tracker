export default function LoadingIndicator({ text = "Chargement..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-black/10 dark:border-white/10 border-t-[var(--accent)]" />
      <p className="text-sm font-medium text-[var(--ink-subtle)]">{text}</p>
    </div>
  );
}
