"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { cn } from "../../lib/cn";
import type { Lang } from "../../lib/i18n";

const options: Array<{ code: Lang; label: string }> = [
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
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
  const selected = options.find((o) => o.code === value) ?? options[0];

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
          "flex items-center gap-2 rounded-2xl bg-[#e0263c] px-4 py-2 text-sm font-semibold",
          "text-[#fff5f5] shadow-[0_4px_18px_rgba(224,38,60,0.45)] transition-all hover:bg-[#ef2f47]"
        )}
      >
        <Globe className="h-4 w-4" />
        <span>{selected.label}</span>
        <ChevronDown className="h-4 w-4" />
      </button>
      {open && (
        <div
          role="listbox"
          aria-label="language"
          className="absolute right-0 z-50 mt-2 w-36 animate-fade-in overflow-visible rounded-2xl"
        >
          {options.map((lang, i) => (
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
                "flex w-full items-center gap-2 bg-[#e0263c] px-4 py-3 text-left text-sm font-semibold",
                "text-[#fff5f5] transition-all hover:bg-[#ef2f47]",
                i === 0 ? "rounded-2xl" : "-mt-2 rounded-2xl pt-5",
                value === lang.code && "shadow-[0_4px_18px_rgba(224,38,60,0.45)]"
              )}
            >
              {value === lang.code && <Globe className="h-4 w-4" />}
              <span className="flex-1">{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}