"use client";

import type { Lang } from "../lib/i18n";

export default function LangToggle({
  lang,
  onChange,
}: {
  lang: Lang;
  onChange: (l: Lang) => void;
}) {
  return (
    <div role="group" aria-label="language" style={{ display: "flex", gap: "0.4rem" }}>
      {(["ru", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          className="ghost"
          aria-pressed={lang === l}
          onClick={() => onChange(l)}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}