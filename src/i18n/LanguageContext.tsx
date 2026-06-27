import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { LANGS, type Lang } from './index';
import { ui, type UiKey } from './ui';

const STORAGE_KEY = 'dg.lang';

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** UI-String in der aktuellen Sprache. {n} u. ä. via vars ersetzbar. */
  t: (key: UiKey, vars?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<Ctx | null>(null);

function initialLang(): Lang {
  if (typeof window === 'undefined') return 'de';
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved && LANGS.includes(saved)) return saved;
  } catch {
    /* ignore */
  }
  return 'de';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      t: (key, vars) => {
        const entry = ui[key];
        let str = (entry && (entry[lang] ?? entry.de)) ?? key;
        if (vars) {
          for (const [k, v] of Object.entries(vars)) {
            str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
          }
        }
        return str;
      },
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useI18n must be used within a LanguageProvider');
  return ctx;
}

export const useLang = () => useI18n().lang;
export const useT = () => useI18n().t;
