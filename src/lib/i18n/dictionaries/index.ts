// lib/i18n/dictionaries/index.ts
import en from "./en";
import ar from "./ar";
import type { Locale } from "../config";

export const dictionaries: Record<Locale, typeof en> = { en, ar };