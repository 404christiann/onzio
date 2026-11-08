import type { Metadata } from "next";
import { PricingBuilder, PricingProposal } from "@/components/pricing-explorations";
import { PricingSection } from "@/components/pricing-section";

export const metadata: Metadata = {
  title: "Onzio · Pricing without a price",
  robots: { index: false, follow: false },
};

const DIRECTIONS = [
  { id: "chosen", label: "Chosen: A plan for each", note: "Now the homepage pricing section." },
  { id: "builder", label: "1. Plan builder", note: "Pick club, league or tournament, then the tools you need; the plan follows." },
  { id: "proposal", label: "2. Quote in one call", note: "Three steps beside a league's scoped plan being accepted." },
];

const label: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "baseline",
  gap: "8px 16px",
  padding: "14px 24px",
  borderTop: "1px solid #dce4de",
  background: "#fff",
  fontSize: 13,
};

export default function PricingExplorations() {
  return (
    <main>
      <nav style={{ position: "sticky", top: 0, zIndex: 10, display: "flex", flexWrap: "wrap", gap: 8, padding: "12px 24px", background: "rgba(255,255,255,.94)", backdropFilter: "blur(12px)", borderBottom: "1px solid #dce4de", fontSize: 14 }}>
        <strong style={{ marginRight: 8, fontWeight: 600 }}>Pricing explorations</strong>
        {DIRECTIONS.map(d => (
          <a key={d.id} href={`#${d.id}`} style={{ color: "#0d8c36" }}>{d.label}</a>
        ))}
      </nav>
      {DIRECTIONS.map(d => (
        <div key={d.id} id={d.id} style={{ scrollMarginTop: 48 }}>
          <div style={label}><strong style={{ fontWeight: 600 }}>{d.label}</strong><span style={{ color: "#566259" }}>{d.note}</span></div>
          {d.id === "chosen" && <PricingSection />}
          {d.id === "builder" && <PricingBuilder />}
          {d.id === "proposal" && <PricingProposal />}
        </div>
      ))}
    </main>
  );
}
