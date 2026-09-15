"use client";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);
  const toggle = () => {
    document.documentElement.classList.toggle("dark");
    const isDark = document.documentElement.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    setDark(isDark);
  };
  return <button aria-label="Toggle theme" onClick={toggle} className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800">{dark ? <Sun size={19}/> : <Moon size={19}/>}</button>;
}
