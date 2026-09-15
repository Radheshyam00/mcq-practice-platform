"use client";
import type { ReactNode } from "react";
import { X } from "lucide-react";

export function Modal({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: ReactNode }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
    <div className="w-full max-w-lg rounded-2xl bg-white p-6 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold">{title}</h2><button onClick={onClose}><X /></button></div>
      {children}
    </div>
  </div>;
}
