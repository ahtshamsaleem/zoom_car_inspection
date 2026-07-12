// hooks/use-translation.ts
"use client";

import { useLanguageStore } from "@/stores/use-language-store";
import { dictionaries } from "@/lib/i18n/dictionaries";

function getNested(obj: any, path: string): string {
  return path.split(".").reduce((acc, key) => acc?.[key], obj) ?? path;
}

export function useTranslation() {
  const locale = useLanguageStore((s) => s.locale);
  const setLocale = useLanguageStore((s) => s.setLocale);
  const dict = dictionaries[locale];

  const t = (key: string) => getNested(dict, key);

  return { t, locale, setLocale };
}