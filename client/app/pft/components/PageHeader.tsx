type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
};

export default function PageHeader({
  eyebrow,
  title,
  description,
  icon,
}: PageHeaderProps) {
  return (
    <header className="rounded-3xl border border-black/5 bg-[var(--surface)] p-8 shadow-[0_20px_60px_-45px_var(--shadow)]">
      <div className="flex flex-wrap items-center gap-3">
        {icon ? (
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f3efe6] dark:bg-white/10 text-[var(--accent)]">
            {icon}
          </div>
        ) : null}
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--ink-subtle)]">
          {eyebrow}
        </p>
      </div>
      <h1 className="mt-4 font-[var(--font-fraunces)] text-4xl leading-tight">
        {title}
      </h1>
      <p className="mt-4 text-sm text-[var(--ink-subtle)]">{description}</p>
    </header>
  );
}
