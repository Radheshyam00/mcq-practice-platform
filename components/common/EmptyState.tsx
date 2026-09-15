export function EmptyState({ title = "Nothing here yet", description = "No records are available." }: { title?: string; description?: string }) {
  return <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-slate-500">{description}</p></div>;
}
