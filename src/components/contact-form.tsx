"use client";

import { CentralIcon } from "@/components/icons/central/icon";
import { FormEvent, useState } from "react";
import { contactInterests } from "@/lib/contact";

type FormStatus = "idle" | "sending" | "success" | "error";

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
          <CentralIcon name="check" />
        </span>
        <p className="form-kicker">Inquiry received</p>
        <h3>Thanks! Your inquiry has been sent.</h3>
        <p>We&apos;ll be in contact soon.</p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <p className="form-kicker">Club inquiry</p>
        <h3>Get started with Onzio.</h3>
        <p>All fields are required.</p>
      </div>
      <div className="form-grid">
        <label>
          <span>Name</span>
          <input type="text" name="name" autoComplete="name" minLength={2} maxLength={80} placeholder="Your name" required />
        </label>
        <label>
          <span>Email</span>
          <input type="email" name="email" autoComplete="email" maxLength={254} placeholder="you@club.com" required />
        </label>
        <label>
          <span>Phone number</span>
          <input type="tel" name="phone" autoComplete="tel" inputMode="tel" minLength={7} maxLength={30} placeholder="(555) 123-4567" required />
        </label>
        <label>
          <span>What are you interested in?</span>
          <span className="form-select">
            <select name="interest" defaultValue="" required>
              <option value="" disabled>Select one</option>
              {contactInterests.map((interest) => <option value={interest.value} key={interest.value}>{interest.label}</option>)}
            </select>
            <CentralIcon name="chevron-down" width={20} height={20} className="form-select-icon" />
          </span>
        </label>
      </div>

      <label className="form-honeypot" aria-hidden="true">
        Company website
        <input type="text" name="companyWebsite" tabIndex={-1} autoComplete="off" />
      </label>

      {status === "error" && <p className="form-error" role="alert">{errorMessage}</p>}

      <button className="button button-primary form-submit" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending inquiry…" : "Send inquiry"}
        <CentralIcon name="arrow" width={18} height={18} />
      </button>
      <p className="form-consent">By submitting, you agree that Onzio may contact you about your inquiry.</p>
    </form>
  );
}
