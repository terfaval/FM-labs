"use client";

import { useId, useMemo, useState } from "react";
import { validateContact } from "@/lib/contact/validateContact";

type Status = "idle" | "loading" | "success" | "error";

type ProjectFeedbackFormProps = {
  projectTitle: string;
  formEndpoint: string;
  variant?: "default" | "inverse";
};

export function ProjectFeedbackForm({
  projectTitle,
  formEndpoint,
  variant = "default",
}: ProjectFeedbackFormProps) {
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
      name: `project-name-${formId}`,
      email: `project-email-${formId}`,
      message: `project-message-${formId}`,
      honeypot: `project-company-${formId}`,
      panel: `project-panel-${formId}`,
    }),
    [formId]
  );
  const ctaClassName = [
    "project-feedback__cta",
    variant === "inverse" ? "project-feedback__cta--inverse" : "",
  ]
    .filter(Boolean)
    .join(" ");

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

    formData.set("subject", projectTitle);

    try {
      const response = await fetch(formEndpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
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
    <div className="project-feedback">
      <button
        type="button"
        className={ctaClassName}
        aria-expanded={isOpen}
        aria-controls={labels.panel}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? "Bezárás" : "Írd meg"}
      </button>

      {isOpen ? (
        <div className="project-feedback__card" id={labels.panel}>
          <p className="project-feedback__intro">
            Ha hibát találtál vagy van egy észrevételed, itt gyorsan jelezheted.
          </p>

          <form className="contact-form" onSubmit={handleSubmit} role="form">
            <div className="contact-row">
              <label htmlFor={labels.name}>Név</label>
              <input
                id={labels.name}
                name="name"
                type="text"
                autoComplete="name"
              />
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
              <label htmlFor={labels.message}>Üzenet</label>
              <textarea
                id={labels.message}
                name="message"
                required
                rows={4}
                aria-invalid={Boolean(errors.message)}
              />
              {errors.message ? (
                <span className="contact-error">{errors.message}</span>
              ) : null}
            </div>

            <div className="contact-honeypot" aria-hidden="true">
              <label htmlFor={labels.honeypot}>Cég</label>
              <input
                id={labels.honeypot}
                name="company"
                type="text"
                tabIndex={-1}
              />
            </div>

            <button className="contact-submit" type="submit" disabled={isBusy}>
              {isBusy ? "Küldés..." : "Üzenet küldése"}
            </button>

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
