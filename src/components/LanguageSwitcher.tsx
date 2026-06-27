import { LANGS, LANG_LABELS, LANG_NAMES, useI18n } from '../i18n';
import './LanguageSwitcher.css';

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  return (
    <div className={`lang-switch ${className}`} role="group" aria-label={t('lang.label')}>
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          className={`lang-switch__btn ${l === lang ? 'lang-switch__btn--active' : ''}`}
          aria-pressed={l === lang}
          aria-label={LANG_NAMES[l]}
          onClick={() => setLang(l)}
        >
          {LANG_LABELS[l]}
        </button>
      ))}
    </div>
  );
}
