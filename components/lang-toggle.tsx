"use client";

import type { Lang } from "../lib/i18n";
import { SegmentedControl } from "./ui/segmented-control";

export default function LangToggle({
  lang,
  onChange,
}: {
  lang: Lang;
  onChange: (l: Lang) => void;
}) {
  return (
    <SegmentedControl
      label="language"
      value={lang}
      onValueChange={(v) => {
        if (v === "ru" || v === "en") onChange(v);
      }}
      options={[
        { value: "ru", label: "RU" },
        { value: "en", label: "EN" },
      ]}
    />
  );
}