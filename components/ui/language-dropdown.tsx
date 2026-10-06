import { useState, useRef, useEffect } from "react";
import { cn } from "../../lib/cn";
import { ChevronDown, Check } from "lucide-react";

const languages = [
  { code: "kk", label: "Қазақша", flag: "🇰🇿" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "en", label: "English", flag: "🇺🇸" },
];

export const Component = ({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (code: string) => void;
}) => {
  const [selected, setSelected] = useState(
    languages.find((l) => l.code === value) ?? languages[0]
  );
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelected(languages.find((l) => l.code === value) ?? languages[0]);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" style={{ position: "relative", zIndex: 100 }} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "datepick-trigger"
        )}
      >
        <span>{selected.flag}</span>
        <span>{selected.label}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          className={cn(
            "absolute right-0 mt-2 w-56 rounded-[14px] overflow-hidden",
            "datepick-panel",
            "z-50",
            "animate-fade-in"
          )}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setSelected(lang);
                setOpen(false);
                onValueChange(lang.code);
              }}
              className={cn(
                "flex items-center gap-2 w-full px-3 py-2 text-sm text-left transition-colors",
                selected.code === lang.code
                  ? "font-semibold text-red-400"
                  : "text-neutral-200 hover:bg-neutral-800"
              )}
            >
              <span>{lang.flag}</span>
              <span className="flex-1">{lang.label}</span>
              {selected.code === lang.code && (
                <Check className="h-4 w-4 text-red-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};