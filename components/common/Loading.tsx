export function Loading({ text = "Loading..." }: { text?: string }) {
  return <div className="flex min-h-32 items-center justify-center text-sm text-slate-500"><span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />{text}</div>;
}
