export default function LoadingIndicator({ text = "Chargement..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-4 border-black/10 dark:border-white/10" />
        <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-4 border-transparent border-t-[var(--accent)]" style={{ animationDuration: '1s' }} />
      </div>
      <p className="text-sm font-medium text-[var(--ink-subtle)]">{text}</p>
    </div>
  );
}
