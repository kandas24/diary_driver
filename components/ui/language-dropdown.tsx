"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
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
          "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm",
          "border-[rgba(224,38,60,0.25)] bg-[rgba(20,9,12,0.8)] backdrop-blur-md shadow-sm",
          "text-[#f4f2ef] transition-all hover:border-[rgba(224,38,60,0.5)]"
        )}
      >
        <Globe className="h-4 w-4 text-[#a89fa4]" />
        <span>{selected.label}</span>
        <ChevronDown className="h-4 w-4 text-[#a89fa4]" />
      </button>
      {open && (
        <div
          role="listbox"
          aria-label="language"
          className="absolute right-0 z-50 mt-2 w-40 animate-fade-in overflow-hidden rounded-xl border border-[rgba(224,38,60,0.25)] bg-[#1a0d11]/95 shadow-lg backdrop-blur-xl"
        >
          {options.map((lang) => (
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
                  ? "font-semibold text-[#e0263c]"
                  : "text-[#f4f2ef] hover:bg-[rgba(224,38,60,0.12)]"
              )}
            >
              <span className="flex-1">{lang.label}</span>
              {value === lang.code && <Check className="h-4 w-4 text-[#e0263c]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}