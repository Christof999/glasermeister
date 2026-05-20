import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import './ContactForm.css';

type Status = 'idle' | 'submitting' | 'success' | 'error';

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  consent: boolean;
  /** Honeypot – must remain empty */
  website: string;
};

const initial: FormState = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  consent: false,
  website: '',
};

export function ContactForm() {
  const [data, setData] = useState<FormState>(initial);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');

    // Honeypot
    if (data.website) {
      setStatus('success');
      return;
    }

    if (!data.consent) {
      setStatus('error');
      setErrorMsg('Bitte stimmen Sie der Datenschutzerklärung zu.');
      return;
    }

    setStatus('submitting');

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
              subject: data.subject || 'Anfrage über die Website',
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
      `Name: ${data.name}\nE-Mail: ${data.email}\nTelefon: ${data.phone}\n\n${data.message}\n`,
    );
    const subject = encodeURIComponent(data.subject || 'Anfrage über die Website');
    window.location.href = `mailto:info@der-glasermeister.de?subject=${subject}&body=${body}`;
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
        <div className="field">
          <label htmlFor="cf-subject">Betreff</label>
          <input
            id="cf-subject"
            type="text"
            value={data.subject}
            onChange={(e) => update('subject', e.target.value)}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="cf-message">Ihre Nachricht <span aria-hidden="true">*</span></label>
        <textarea
          id="cf-message"
          rows={6}
          required
          value={data.message}
          onChange={(e) => update('message', e.target.value)}
        />
      </div>

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
