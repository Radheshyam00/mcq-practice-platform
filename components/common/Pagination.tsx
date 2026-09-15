"use client";
import { Button } from "./Button";

export function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  return <div className="flex items-center justify-center gap-2 py-6"><Button variant="outline" disabled={page <= 1} onClick={() => onChange(page - 1)}>Previous</Button><span className="px-3 text-sm">Page {page} of {totalPages}</span><Button variant="outline" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Next</Button></div>;
}
