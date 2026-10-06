"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../../lib/cn";
import type { Lang } from "../../lib/i18n";

const languages: Array<{ code: Lang; short: string; label: string; flag: string }> = [
  { code: "en", short: "US", label: "English", flag: "🇺🇸" },
  { code: "ru", short: "RU", label: "Русский", flag: "🇷🇺" },
];

export default function LanguageDropdown({
  value,
  onValueChange,
}: {
  value: Lang;
  onValueChange: (l: Lang) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = languages.find((l) => l.code === value) ?? languages[0];

  useEffect(() => {
    function outside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function esc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", outside);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", outside);
      document.removeEventListener("keydown", esc);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm",
          "border-[#2a2a2a] bg-[#171717]/90 shadow-sm backdrop-blur-md",
          "text-[#e5e5e5] transition-all hover:bg-[#262626]"
        )}
      >
        <span>{selected.flag}</span>
        <span>{selected.label}</span>
        <ChevronDown className="h-4 w-4" />
      </button>
      {open && (
        <div
          role="listbox"
          aria-label="language"
          className="absolute right-0 z-50 mt-2 w-48 animate-fade-in overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#171717]/95 shadow-lg backdrop-blur-xl"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              role="option"
              aria-selected={value === lang.code}
              onClick={() => {
                onValueChange(lang.code);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors",
                value === lang.code
                  ? "font-semibold text-[#60a5fa]"
                  : "text-[#e5e5e5] hover:bg-[#262626]"
              )}
            >
              <span className="text-xs text-[#a3a3a3]">{lang.short}</span>
              <span>{lang.flag}</span>
              <span className="flex-1">{lang.label}</span>
              {value === lang.code && <Check className="h-4 w-4 text-[#60a5fa]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}