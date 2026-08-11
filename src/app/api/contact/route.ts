import { Resend } from "resend";
import { contactInterestLabels, type ContactInterest } from "@/lib/contact";

export const runtime = "nodejs";

const MAX_BODY_SIZE = 10_000;

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  interest?: unknown;
  companyWebsite?: unknown;
};

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    "\"": "&quot;",
  })[character] ?? character);
}

function json(body: { ok: boolean; message?: string }, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_SIZE) return json({ ok: false, message: "That submission is too large." }, 413);

  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return json({ ok: false, message: "That submission could not be accepted." }, 403);

  let payload: ContactPayload;
  try {
    payload = await request.json() as ContactPayload;
  } catch {
    return json({ ok: false, message: "Please check the form and try again." }, 400);
  }

  const name = readString(payload.name);
  const email = readString(payload.email).toLowerCase();
  const phone = readString(payload.phone);
  const interest = readString(payload.interest) as ContactInterest;
  const companyWebsite = readString(payload.companyWebsite);

  if (companyWebsite) return json({ ok: true });

  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const phoneIsValid = /^[+()\d.\-\s]{7,30}$/.test(phone) && phone.replace(/\D/g, "").length >= 7;
  const interestLabel = contactInterestLabels[interest];

  if (name.length < 2 || name.length > 80 || !emailIsValid || email.length > 254 || !phoneIsValid || !interestLabel) {
    return json({ ok: false, message: "Please complete every field with valid information." }, 400);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return json({ ok: false, message: "Email delivery is not configured yet. Please try again later." }, 503);
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone);
  const safeInterest = escapeHtml(interestLabel);

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `New Onzio inquiry — ${interestLabel}`,
      text: `New Onzio website inquiry\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nInterest: ${interestLabel}`,
      html: `
        <div style="font-family:Arial,sans-serif;background:#f4f7f4;padding:32px;color:#122018">
          <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #dce5de;border-radius:16px;overflow:hidden">
            <div style="padding:24px 28px;background:#0b4d2c;color:#ffffff">
              <p style="margin:0 0 8px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#9fe7b7">Onzio website</p>
              <h1 style="margin:0;font-size:24px;line-height:1.25">New club inquiry</h1>
            </div>
            <div style="padding:28px">
              <table style="width:100%;border-collapse:collapse;font-size:15px;line-height:1.5">
                <tr><td style="padding:10px 0;color:#68746c;width:120px">Name</td><td style="padding:10px 0;font-weight:600">${safeName}</td></tr>
                <tr><td style="padding:10px 0;color:#68746c">Email</td><td style="padding:10px 0"><a href="mailto:${safeEmail}" style="color:#0b7a36">${safeEmail}</a></td></tr>
                <tr><td style="padding:10px 0;color:#68746c">Phone</td><td style="padding:10px 0"><a href="tel:${safePhone}" style="color:#0b7a36">${safePhone}</a></td></tr>
                <tr><td style="padding:10px 0;color:#68746c">Interest</td><td style="padding:10px 0">${safeInterest}</td></tr>
              </table>
              <p style="margin:24px 0 0;padding-top:20px;border-top:1px solid #e6ebe7;color:#68746c;font-size:13px">Reply to this email to contact the lead directly.</p>
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Contact form delivery failed");
      return json({ ok: false, message: "Your inquiry could not be sent. Please try again." }, 502);
    }

    return json({ ok: true });
  } catch {
    console.error("Contact form delivery failed");
    return json({ ok: false, message: "Your inquiry could not be sent. Please try again." }, 502);
  }
}
