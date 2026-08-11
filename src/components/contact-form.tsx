"use client";

import { FormEvent, useState } from "react";
import { contactInterests } from "@/lib/contact";
import { button } from "@/lib/styles";

type FormStatus = "idle" | "sending" | "success" | "error";

const cardClass =
  "rounded-[22px] bg-white p-6 text-ink shadow-[0_0_0_1px_rgba(255,255,255,0.16),0_30px_80px_rgba(0,27,12,0.27)] sm:p-[38px]";

const labelClass = "grid min-w-0 gap-[7px]";
const labelTextClass = "text-[11px] font-semibold";
const fieldClass =
  "h-12 w-full min-w-0 rounded-lg border border-[#d7dfd9] bg-[#fbfcfb] px-3.5 text-[13px] text-ink outline-none transition-[border-color,box-shadow,background-color] duration-150 ease-out placeholder:text-[#a0aaa3] focus:border-green focus:bg-white focus:shadow-[0_0_0_4px_rgba(18,161,64,0.1)]";
const selectClass = `${fieldClass} appearance-none [background-image:linear-gradient(45deg,transparent_50%,#6e7b72_50%),linear-gradient(135deg,#6e7b72_50%,transparent_50%)] [background-position:calc(100%-16px)_21px,calc(100%-11px)_21px] [background-repeat:no-repeat] [background-size:5px_5px,5px_5px]`;

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
      <div className={`${cardClass} flex min-h-[420px] flex-col items-start justify-center sm:min-h-[535px]`} role="status" aria-live="polite">
        <span className="mb-7 grid size-[58px] place-items-center rounded-full bg-green-soft text-green-hover" aria-hidden="true">
          <svg className="size-7 fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.8]" viewBox="0 0 24 24"><path d="m5 12.5 4.2 4L19 7" /></svg>
        </span>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.11em] text-green-hover">Inquiry received</p>
        <h3 className="max-w-[390px] font-display text-[43px] font-bold uppercase leading-[0.96] tracking-[-0.01em] text-balance sm:text-5xl">Thanks! Your inquiry has been sent.</h3>
        <p className="mt-4 text-[15px] text-muted">We&apos;ll be in contact soon.</p>
      </div>
    );
  }

  return (
    <form className={`${cardClass} sm:min-h-[535px]`} onSubmit={handleSubmit}>
      <div className="mb-6 sm:mb-7">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.11em] text-green-hover">Club inquiry</p>
        <h3 className="text-[26px] font-semibold tracking-[-0.035em]">Get started with Onzio.</h3>
        <p className="mt-1.5 text-[11px] text-muted">All fields are required.</p>
      </div>
      <div className="grid gap-[15px] sm:grid-cols-2 sm:gap-x-[15px] sm:gap-y-[18px]">
        <label className={labelClass}>
          <span className={labelTextClass}>Name</span>
          <input className={fieldClass} type="text" name="name" autoComplete="name" minLength={2} maxLength={80} placeholder="Your name" required />
        </label>
        <label className={labelClass}>
          <span className={labelTextClass}>Email</span>
          <input className={fieldClass} type="email" name="email" autoComplete="email" maxLength={254} placeholder="you@club.com" required />
        </label>
        <label className={labelClass}>
          <span className={labelTextClass}>Phone number</span>
          <input className={fieldClass} type="tel" name="phone" autoComplete="tel" inputMode="tel" minLength={7} maxLength={30} placeholder="(555) 123-4567" required />
        </label>
        <label className={labelClass}>
          <span className={labelTextClass}>What are you interested in?</span>
          <select className={selectClass} name="interest" defaultValue="" required>
            <option value="" disabled>Select one</option>
            {contactInterests.map((interest) => <option value={interest.value} key={interest.value}>{interest.label}</option>)}
          </select>
        </label>
      </div>

      <label className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
        Company website
        <input type="text" name="companyWebsite" tabIndex={-1} autoComplete="off" />
      </label>

      {status === "error" && <p className="mt-4 rounded-lg border border-[#f0c7c7] bg-[#fff2f2] px-3 py-[11px] text-xs leading-[1.45] text-[#9b2424]" role="alert">{errorMessage}</p>}

      <button className={`${button()} mt-6 w-full disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0 disabled:active:scale-100`} type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending inquiry…" : "Send inquiry"}
        <svg className="fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.6]" aria-hidden="true" viewBox="0 0 18 18" width="18" height="18"><path d="M3.5 9h11m-4-4 4 4-4 4" /></svg>
      </button>
      <p className="mt-3.5 text-center text-[10px] leading-normal text-[#879289]">By submitting, you agree that Onzio may contact you about your inquiry.</p>
    </form>
  );
}
