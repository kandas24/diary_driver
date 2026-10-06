"use client";

import type { Lang } from "../lib/i18n";
import LanguageDropdown from "./ui/language-dropdown";

export default function LangToggle({
  lang,
  onChange,
}: {
  lang: Lang;
  onChange: (l: Lang) => void;
}) {
  return <LanguageDropdown value={lang} onValueChange={onChange} />;
}