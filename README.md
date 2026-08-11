# Onzio

Onzio's public marketing site, built with Next.js and React.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Add the Resend API key to `.env.local` to enable contact-form delivery. The configured sender uses the verified `auth.onziofutbol.com` domain.

## Commands

- `npm run dev` — start the local development server
- `npm run lint` — run ESLint
- `npm run build` — create a production build
