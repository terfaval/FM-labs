"use client";

import { useId, useMemo, useState } from "react";
import { Meta } from "@/lib/content/types";
import { validateContact } from "@/lib/contact/validateContact";

type Status = "idle" | "loading" | "success" | "error";

type ContactSectionProps = {
  meta: Meta;
  formEndpoint: string;
};

const CONTACT_LINKS = [
  { label: "Telefon", value: "+36308269351", href: "tel:+36308269351" },
  {
    label: "Email",
    value: "mate.fater@gmail.com",
    href: "mailto:mate.fater@gmail.com"
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/matefater",
    href: "https://www.linkedin.com/in/matefater/"
  }
] as const;

export function ContactSection({ meta, formEndpoint }: ContactSectionProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<{ message?: string; email?: string }>(
    {}
  );
  const [feedback, setFeedback] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const formId = useId();

  const isBusy = status === "loading";
  const hasSuccess = status === "success";
  const hasError = status === "error";

  const labels = useMemo(
    () => ({
      name: `contact-name-${formId}`,
      email: `contact-email-${formId}`,
      subject: `contact-subject-${formId}`,
      message: `contact-message-${formId}`,
      honeypot: `contact-company-${formId}`,
      panel: `contact-panel-${formId}`
    }),
    [formId]
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formEndpoint) {
      setStatus("error");
      setFeedback("A küldés most nem érhető el.");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    if ((formData.get("company") ?? "").toString().trim().length > 0) {
      setStatus("success");
      setFeedback("Köszönöm, az üzenet megérkezett.");
      form.reset();
      return;
    }

    const message = (formData.get("message") ?? "").toString();
    const email = (formData.get("email") ?? "").toString();

    const validation = validateContact({ message, email });
    if (!validation.valid) {
      setErrors(validation.errors);
      setStatus("error");
      setFeedback("Kérlek, ellenőrizd a mezőket.");
      return;
    }

    setErrors({});
    setStatus("loading");
    setFeedback("");

    try {
      const response = await fetch(formEndpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData
      });

      if (!response.ok) {
        throw new Error("request_failed");
      }

      setStatus("success");
      setFeedback("Köszönöm, az üzenet megérkezett.");
      form.reset();
    } catch {
      setStatus("error");
      setFeedback("Most nem sikerült elküldeni. Próbáld újra később.");
    }
  }

  return (
    <div className="contact-section">
      <p className="contact-intro">{meta.contactIntro}</p>

      <div className="contact-links">
        {CONTACT_LINKS.map((link) => (
          <div className="contact-link" key={link.label}>
            <span className="contact-link__label">{link.label}</span>
            <a
              href={link.href}
              target={link.label === "LinkedIn" ? "_blank" : undefined}
              rel={link.label === "LinkedIn" ? "noreferrer" : undefined}
            >
              {link.value}
            </a>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="contact-cta"
        aria-expanded={isOpen}
        aria-controls={labels.panel}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? "Bezárás" : "Lépjünk kapcsolatba"}
      </button>

      {isOpen ? (
        <div className="contact-card" id={labels.panel}>
          <form className="contact-form" onSubmit={handleSubmit} role="form">
            <div className="contact-row">
              <label htmlFor={labels.name}>Név</label>
              <input id={labels.name} name="name" type="text" autoComplete="name" />
            </div>

            <div className="contact-row">
              <label htmlFor={labels.email}>Email cím</label>
              <input
                id={labels.email}
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email ? (
                <span className="contact-error">{errors.email}</span>
              ) : null}
            </div>

            <div className="contact-row">
              <label htmlFor={labels.subject}>Tárgy</label>
              <input id={labels.subject} name="subject" type="text" />
            </div>

            <div className="contact-row">
              <label htmlFor={labels.message}>Üzenet</label>
              <textarea
                id={labels.message}
                name="message"
                required
                rows={6}
                aria-invalid={Boolean(errors.message)}
              />
              {errors.message ? (
                <span className="contact-error">{errors.message}</span>
              ) : null}
            </div>

            <div className="contact-honeypot" aria-hidden="true">
              <label htmlFor={labels.honeypot}>Cég</label>
              <input id={labels.honeypot} name="company" type="text" tabIndex={-1} />
            </div>

            <button className="contact-submit" type="submit" disabled={isBusy}>
              {isBusy ? "Küldés..." : meta.contactSubmitLabel}
            </button>

            <p className="contact-helper">{meta.contactHelper}</p>

            <p
              className={`contact-feedback ${hasSuccess ? "is-success" : ""} ${
                hasError ? "is-error" : ""
              }`}
              role="status"
              aria-live="polite"
            >
              {feedback}
            </p>
          </form>
        </div>
      ) : null}
    </div>
  );
}
