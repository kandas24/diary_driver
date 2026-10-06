"use client";

import type { Lang } from "../lib/i18n";
import { Component } from "./ui/language-dropdown";

export default function LangToggle({
  lang,
  onChange,
}: {
  lang: Lang;
  onChange: (l: Lang) => void;
}) {
  return <Component value={lang} onValueChange={(c) => onChange(c as Lang)} />;
}