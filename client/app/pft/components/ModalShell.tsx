type ModalShellProps = {
  id: string;
  title: string;
  triggerContent: React.ReactNode;
  children: React.ReactNode;
};

export default function ModalShell({
  id,
  title,
  triggerContent,
  children,
}: ModalShellProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <input id={id} type="checkbox" className="peer hidden" />
      <label
        htmlFor={id}
        className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white transition hover:brightness-95"
      >
        {triggerContent}
      </label>
      <div className="pointer-events-none fixed inset-0 z-20 flex items-center justify-center bg-black/40 opacity-0 transition peer-checked:pointer-events-auto peer-checked:opacity-100">
        <div className="w-full max-w-lg rounded-3xl bg-white p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
