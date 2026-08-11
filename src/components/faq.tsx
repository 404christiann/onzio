"use client";

import { useLayoutEffect, useRef, useState } from "react";

const faqs = [
  {
    question: "What is included in the $65 monthly price?",
    answer:
      "Plans start at $65 per month and include your professional club website, hosting, the Onzio admin portal, and platform updates. Your final monthly price depends on the scope of your club's website and platform needs.",
  },
  {
    question: "Is the initial website setup included?",
    answer:
      "No. Initial website setup is quoted separately after we understand your club, content, and design needs. The monthly subscription begins with the managed platform itself.",
  },
  {
    question: "Is domain registration included?",
    answer:
      "No. Domain registration is separate from the monthly subscription. If your club already owns a domain, it can be connected to the website.",
  },
  {
    question: "Can our club update the website?",
    answer:
      "Yes. Approved club staff can use the admin portal to update the homepage, programs, tryouts, roster, schedule, match results, sponsors, and other supported club content.",
  },
  {
    question: "Is the subscription month-to-month?",
    answer:
      "Yes. Onzio is month-to-month with no annual commitment and no special notice period. Cancel before the next renewal and your access continues through the period you already paid for.",
  },
  {
    question: "Does Onzio handle player registration or participant payments?",
    answer:
      "No. Registration, participant records, waivers, and participant payments remain separate from Onzio. Your public website can direct families to the registration process your club chooses.",
  },
];

function AccordionPanel({
  panelId,
  triggerId,
  isOpen,
  children,
}: {
  panelId: string;
  triggerId: string;
  isOpen: boolean;
  children: React.ReactNode;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState(0);

  useLayoutEffect(() => {
    if (contentRef.current) setMaxHeight(contentRef.current.scrollHeight);
  }, [isOpen]);

  return (
    <div
      id={panelId}
      role="region"
      aria-labelledby={triggerId}
      className="overflow-hidden transition-[max-height] duration-300 ease-out"
      style={{ maxHeight: isOpen ? `${maxHeight}px` : "0px" }}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto grid max-w-[760px] gap-3">
      {faqs.map((item, index) => {
        const isOpen = openIndex === index;
        const triggerId = `faq-trigger-${index}`;
        const panelId = `faq-panel-${index}`;
        return (
          <div
            className="rounded-2xl bg-white shadow-[0_0_0_1px_rgba(16,23,18,0.07),0_1px_2px_rgba(16,23,18,0.04)] transition-shadow duration-150 ease-out hover:shadow-[0_0_0_1px_rgba(16,23,18,0.1),0_2px_6px_rgba(16,23,18,0.06)]"
            key={item.question}
          >
            <h3>
              <button
                type="button"
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-6 rounded-2xl px-5 py-[18px] text-left text-[15px] font-semibold tracking-[-0.01em] text-ink sm:px-6"
              >
                <span>{item.question}</span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  width="16"
                  height="16"
                  className={`flex-none transition-transform duration-200 ease-out ${isOpen ? "rotate-180 text-green-hover" : "text-muted"}`}
                >
                  <path d="m3.5 6 4.5 4.5L12.5 6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
                </svg>
              </button>
            </h3>
            <AccordionPanel panelId={panelId} triggerId={triggerId} isOpen={isOpen}>
              <p className="px-5 pb-5 text-sm leading-[1.65] text-muted text-pretty sm:px-6">{item.answer}</p>
            </AccordionPanel>
          </div>
        );
      })}
    </div>
  );
}
