// components/language-provider.tsx
"use client";

import { useEffect } from "react";
import { useLanguageStore } from "@/stores/use-language-store";
import { getDirection } from "@/lib/i18n/config";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useLanguageStore.persist.rehydrate();

    const { locale } = useLanguageStore.getState();
    document.documentElement.lang = locale;
    document.documentElement.dir = getDirection(locale);

    return useLanguageStore.subscribe((state) => {
      document.documentElement.lang = state.locale;
      document.documentElement.dir = getDirection(state.locale);
    });
  }, []);

  return <>{children}</>;
}