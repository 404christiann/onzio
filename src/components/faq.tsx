"use client";

import { useLayoutEffect, useRef, useState } from "react";

const items = [
  {
    question: "What is included in the $65 monthly price?",
    answer: "Plans start at $65 per month and include your professional club website, hosting, the Onzio admin portal, and platform updates. Your final monthly price depends on the scope of your club's website and platform needs.",
  },
  {
    question: "Is the initial website setup included?",
    answer: "No. Initial website setup is quoted separately after we understand your club, content, and design needs. The monthly subscription begins with the managed platform itself.",
  },
  {
    question: "Is domain registration included?",
    answer: "No. Domain registration is separate from the monthly subscription. If your club already owns a domain, it can be connected to the website.",
  },
  {
    question: "Can our club update the website?",
    answer: "Yes. Approved club staff can use the admin portal to update the homepage, programs, tryouts, roster, schedule, match results, sponsors, and other supported club content.",
  },
  {
    question: "Is the subscription month-to-month?",
    answer: "Yes. Onzio is month-to-month with no annual commitment and no special notice period. Cancel before the next renewal and your access continues through the period you already paid for.",
  },
  {
    question: "Does Onzio handle player registration or participant payments?",
    answer: "No. Registration, participant records, waivers, and participant payments remain separate from Onzio. Your public website can direct families to the registration process your club chooses.",
  },
];

function FaqAnswer({ contentId, isOpen, answer }: { contentId: string; isOpen: boolean; answer: string }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState(0);

  // A CSS-only grid-template-rows 0fr->1fr collapse can get stuck at zero
  // height in Chrome for this kind of nested-content structure. Measuring
  // the content's natural height and animating max-height is reliable.
  useLayoutEffect(() => {
    if (contentRef.current) setMaxHeight(contentRef.current.scrollHeight);
  }, [isOpen]);

  return (
    <div className="faq-answer-wrap" id={contentId} aria-hidden={!isOpen} style={{ maxHeight: isOpen ? maxHeight : 0 }}>
      <div ref={contentRef}><p>{answer}</p></div>
    </div>
  );
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="faq-list">
      {items.map((item, index) => {
        const isOpen = index === openIndex;
        const contentId = `faq-content-${index}`;
        return (
          <article className={`faq-item ${isOpen ? "is-open" : ""}`} key={item.question}>
            <h3>
              <button type="button" aria-expanded={isOpen} aria-controls={contentId} onClick={() => setOpenIndex(isOpen ? -1 : index)}>
                <span>{item.question}</span>
                <svg aria-hidden="true" viewBox="0 0 20 20" width="20" height="20"><path d="M4 10h12M10 4v12" /></svg>
              </button>
            </h3>
            <FaqAnswer contentId={contentId} isOpen={isOpen} answer={item.answer} />
          </article>
        );
      })}
    </div>
  );
}
