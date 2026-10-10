"use client";

import { useState, type CSSProperties, type FormEvent } from "react";
import { contactInterests, type ContactInterest } from "@/lib/contact";

type FormStatus = "idle" | "sending" | "success" | "error";
type ContactIconName = "user" | "mail" | "phone" | "globe" | "refresh" | "book-open" | "message-circle" | "arrow-right" | "check-circle";

const interestIcons = {
  "new-club-website": "globe",
  "replace-club-website": "refresh",
  "learn-about-onzio": "book-open",
  "something-else": "message-circle",
} satisfies Record<ContactInterest, ContactIconName>;

function ContactIcon({ name }: { name: ContactIconName }) {
  return <span className="contact-icon" aria-hidden="true" style={{ "--contact-icon": `url("/icons/contact/${name}.svg")` } as CSSProperties} />;
}

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          interest: formData.get("interest"),
          companyWebsite: formData.get("companyWebsite"),
        }),
      });

      const result = await response.json() as { ok?: boolean; message?: string };
      if (!response.ok || !result.ok) {
        throw new Error(result.message ?? "Your inquiry could not be sent. Please try again.");
      }

      form.reset();
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Your inquiry could not be sent. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="contact-form contact-success" role="status" aria-live="polite">
        <span className="success-mark" aria-hidden="true">
          <ContactIcon name="check-circle" />
        </span>
        <h3>Thanks for reaching out.</h3>
        <p>Your inquiry has been sent. We&apos;ll be in contact soon.</p>
      </div>
    );
  }

  return (
    <form className="contact-form" aria-label="Club inquiry" aria-busy={status === "sending"} onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          <span>Name</span>
          <span className="form-control">
            <ContactIcon name="user" />
            <input type="text" name="name" autoComplete="name" minLength={2} maxLength={80} placeholder="Your name" required />
          </span>
        </label>
        <label>
          <span>Email</span>
          <span className="form-control">
            <ContactIcon name="mail" />
            <input type="email" name="email" autoComplete="email" maxLength={254} placeholder="you@club.com" required />
          </span>
        </label>
        <label>
          <span>Phone number</span>
          <span className="form-control">
            <ContactIcon name="phone" />
            <input type="tel" name="phone" autoComplete="tel" inputMode="tel" minLength={7} maxLength={30} placeholder="(555) 123-4567" required />
          </span>
        </label>
      </div>

      <fieldset className="form-topics">
        <legend>What are you interested in?</legend>
        <div className="form-topic-grid">
          {contactInterests.map((interest) => (
            <label className="form-topic" key={interest.value}>
              <input type="radio" name="interest" value={interest.value} required />
              <span className="form-topic-content">
                <ContactIcon name={interestIcons[interest.value]} />
                <span>{interest.label}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="form-honeypot" aria-hidden="true">
        Company website
        <input type="text" name="companyWebsite" tabIndex={-1} autoComplete="off" />
      </label>

      {status === "error" && <p className="form-error" role="alert">{errorMessage}</p>}

      <button className="button button-primary form-submit" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending inquiry…" : "Send inquiry"}
        <ContactIcon name="arrow-right" />
      </button>
      <p className="form-consent">By submitting, you agree that Onzio may contact you about your inquiry.</p>
      <p className="form-handoff"><ContactIcon name="message-circle" />Your inquiry goes directly to Christian.</p>
    </form>
  );
}
