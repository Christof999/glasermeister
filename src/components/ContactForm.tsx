import { useLayoutEffect, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './ContactForm.css';

type Status = 'idle' | 'submitting' | 'success' | 'error';

type FormState = {
  name: string;
  email: string;
  phone: string;
  category: string;
  budgetMin: number;
  budgetMax: number;
  message: string;
  consent: boolean;
  /** Honeypot – must remain empty */
  website: string;
};

/** Budget slider bounds (in €) */
const BUDGET_MIN = 800;
const BUDGET_MAX = 4000;
const BUDGET_STEP = 100;
/** Minimum distance the two thumbs keep between each other */
const BUDGET_GAP = 100;

const initial: FormState = {
  name: '',
  email: '',
  phone: '',
  category: '',
  budgetMin: BUDGET_MIN,
  budgetMax: BUDGET_MAX,
  message: '',
  consent: false,
  website: '',
};

/** Selectable services. `sonderwunsch` gets its own description heading. */
const categories: { value: string; label: string }[] = [
  { value: 'duschkabinen', label: 'Duschkabine' },
  { value: 'glastueren', label: 'Glastüren & Trennwände' },
  { value: 'vordaecher', label: 'Vordächer' },
  { value: 'treppengelaender', label: 'Treppengeländer' },
  { value: 'antike-fenster', label: 'Antike Fenster' },
  { value: 'sonderwunsch', label: 'Sonderwunsch' },
];

const fmtEuro = (n: number) => `${n.toLocaleString('de-DE')} €`;
const pct = (v: number) => ((v - BUDGET_MIN) / (BUDGET_MAX - BUDGET_MIN)) * 100;

export function ContactForm() {
  const [data, setData] = useState<FormState>(initial);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const isSonderwunsch = data.category === 'sonderwunsch';
  const hasCategory = data.category !== '';
  const categoryLabel =
    categories.find((c) => c.value === data.category)?.label ?? '';

  const setBudgetMin = (v: number) =>
    update('budgetMin', Math.min(v, data.budgetMax - BUDGET_GAP));
  const setBudgetMax = (v: number) =>
    update('budgetMax', Math.max(v, data.budgetMin + BUDGET_GAP));

  /** Grow the description textarea to fit its content. */
  const autoGrow = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };

  // Re-fit when the field appears or its heading (and thus value) changes.
  useLayoutEffect(() => {
    autoGrow(textareaRef.current);
  }, [hasCategory, data.message]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');

    // Honeypot
    if (data.website) {
      setStatus('success');
      return;
    }

    if (!data.category) {
      setStatus('error');
      setErrorMsg('Bitte wählen Sie aus, worum es geht.');
      return;
    }

    if (isSonderwunsch && !data.message.trim()) {
      setStatus('error');
      setErrorMsg('Bitte beschreiben Sie Ihren Sonderwunsch kurz.');
      return;
    }

    if (!data.consent) {
      setStatus('error');
      setErrorMsg('Bitte stimmen Sie der Datenschutzerklärung zu.');
      return;
    }

    setStatus('submitting');

    const budgetText = `${fmtEuro(data.budgetMin)} – ${fmtEuro(data.budgetMax)}`;
    const subject = `${categoryLabel} – Anfrage über die Website`;

    // Optional EmailJS hookup via env – sends only when configured.
    // See README for setup. Falls back to mailto otherwise.
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (serviceId && templateId && publicKey) {
      try {
        const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_id: serviceId,
            template_id: templateId,
            user_id: publicKey,
            template_params: {
              from_name: data.name,
              reply_to: data.email,
              phone: data.phone,
              subject,
              category: categoryLabel,
              budget: budgetText,
              message: data.message,
            },
          }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setStatus('success');
        setData(initial);
        return;
      } catch (err) {
        setStatus('error');
        setErrorMsg('Versand fehlgeschlagen. Bitte versuchen Sie es per Telefon oder E-Mail.');
        return;
      }
    }

    // Fallback: open user's mail client
    const body = encodeURIComponent(
      `Name: ${data.name}\nE-Mail: ${data.email}\nTelefon: ${data.phone}\n` +
        `Leistung: ${categoryLabel}\nBudget: ${budgetText}\n\n${data.message}\n`,
    );
    window.location.href = `mailto:info@der-glasermeister.de?subject=${encodeURIComponent(
      subject,
    )}&body=${body}`;
    setStatus('success');
    setData(initial);
  };

  if (status === 'success') {
    return (
      <motion.div
        className="contact-form contact-form--success"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        role="status"
        aria-live="polite"
      >
        <div className="contact-form__check" aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M10 16l4 4 8-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3>Vielen Dank!</h3>
        <p>Ihre Nachricht ist auf dem Weg. Ich melde mich schnellstmöglich bei Ihnen.</p>
        <button type="button" className="btn btn--ghost" onClick={() => setStatus('idle')}>
          Weitere Nachricht senden
        </button>
      </motion.div>
    );
  }

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      <div className="contact-form__grid">
        <div className="field">
          <label htmlFor="cf-name">Name <span aria-hidden="true">*</span></label>
          <input
            id="cf-name"
            type="text"
            required
            autoComplete="name"
            value={data.name}
            onChange={(e) => update('name', e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="cf-email">E-Mail <span aria-hidden="true">*</span></label>
          <input
            id="cf-email"
            type="email"
            required
            autoComplete="email"
            value={data.email}
            onChange={(e) => update('email', e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="cf-phone">Telefon</label>
          <input
            id="cf-phone"
            type="tel"
            autoComplete="tel"
            value={data.phone}
            onChange={(e) => update('phone', e.target.value)}
          />
        </div>
      </div>

      {/* Service selection */}
      <fieldset className="field cat-field">
        <legend>Worum geht es? <span aria-hidden="true">*</span></legend>
        <div className="cat-group" role="radiogroup" aria-label="Gewünschte Leistung">
          {categories.map((c) => (
            <label key={c.value} className="cat-chip">
              <input
                type="radio"
                name="category"
                value={c.value}
                checked={data.category === c.value}
                onChange={() => update('category', c.value)}
              />
              <span>{c.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <AnimatePresence initial={false}>
        {hasCategory && (
          <motion.div
            key="details"
            className="contact-form__reveal"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Budget range slider */}
            <div className="field budget">
              <div className="budget__head">
                <label id="cf-budget-label">Budgetrahmen</label>
                <span className="budget__readout" aria-hidden="true">
                  {fmtEuro(data.budgetMin)} – {fmtEuro(data.budgetMax)}
                </span>
              </div>

              <div className="range">
                <div className="range__track">
                  <div
                    className="range__fill"
                    style={{ left: `${pct(data.budgetMin)}%`, right: `${100 - pct(data.budgetMax)}%` }}
                  />
                </div>

                <input
                  type="range"
                  className="range__input range__input--min"
                  min={BUDGET_MIN}
                  max={BUDGET_MAX}
                  step={BUDGET_STEP}
                  value={data.budgetMin}
                  aria-labelledby="cf-budget-label"
                  aria-valuetext={fmtEuro(data.budgetMin)}
                  onChange={(e) => setBudgetMin(Number(e.target.value))}
                />
                <input
                  type="range"
                  className="range__input range__input--max"
                  min={BUDGET_MIN}
                  max={BUDGET_MAX}
                  step={BUDGET_STEP}
                  value={data.budgetMax}
                  aria-labelledby="cf-budget-label"
                  aria-valuetext={fmtEuro(data.budgetMax)}
                  onChange={(e) => setBudgetMax(Number(e.target.value))}
                />

                <output className="range__bubble" style={{ left: `${pct(data.budgetMin)}%` }}>
                  {fmtEuro(data.budgetMin)}
                </output>
                <output className="range__bubble" style={{ left: `${pct(data.budgetMax)}%` }}>
                  {fmtEuro(data.budgetMax)}
                </output>
              </div>

              <div className="budget__scale" aria-hidden="true">
                <span>{fmtEuro(BUDGET_MIN)}</span>
                <span>{fmtEuro(BUDGET_MAX)}</span>
              </div>
            </div>

            {/* Conditional description field */}
            <div className="field">
              <label htmlFor="cf-message">
                {isSonderwunsch
                  ? 'Erzähl mir was darüber'
                  : 'Noch etwas, dass ich wissen sollte?'}
                {isSonderwunsch && <span aria-hidden="true"> *</span>}
              </label>
              <textarea
                id="cf-message"
                ref={textareaRef}
                className="textarea--grow"
                rows={isSonderwunsch ? 4 : 3}
                required={isSonderwunsch}
                value={data.message}
                placeholder={
                  isSonderwunsch
                    ? 'Beschreiben Sie Ihre Idee – Maße, Glasart, Einsatzort, alles hilft.'
                    : 'Optional – z. B. Maße, Wunschtermin oder besondere Anforderungen.'
                }
                onChange={(e) => update('message', e.target.value)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Honeypot – not announced */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="cf-website">Website</label>
        <input
          id="cf-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={data.website}
          onChange={(e) => update('website', e.target.value)}
        />
      </div>

      <div className="field field--checkbox">
        <input
          id="cf-consent"
          type="checkbox"
          required
          checked={data.consent}
          onChange={(e) => update('consent', e.target.checked)}
        />
        <label htmlFor="cf-consent">
          Ich habe die <a href="/datenschutz">Datenschutzerklärung</a> gelesen und stimme der
          Verarbeitung meiner Daten zur Bearbeitung meiner Anfrage zu.{' '}
          <span aria-hidden="true">*</span>
        </label>
      </div>

      {status === 'error' && (
        <p className="contact-form__error" role="alert">{errorMsg}</p>
      )}

      <div className="contact-form__actions">
        <button
          type="submit"
          className="btn btn--primary"
          aria-disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'Wird gesendet…' : 'Anfrage senden'}
        </button>
        <p className="contact-form__hint">
          Lieber direkt? <a href="tel:+491752533137">0175 2533137</a> oder{' '}
          <a href="mailto:info@der-glasermeister.de">info@der-glasermeister.de</a>
        </p>
      </div>
    </form>
  );
}
