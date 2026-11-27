"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { CostsPicture, RegistrationPicture, WebsitePicture } from "@/components/stageshow/section-demos";
import styles from "./faq.module.css";

const items = [
  {
    question: "How much does Onzio cost?",
    answer: "Every plan includes your professional website, hosting, the Onzio admin portal, and platform updates. Your monthly price depends on what your club, league, or tournament needs, and we scope it with you in one conversation.",
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
    answer: "Yes. Clubs can create native registration forms, collect participant details and waivers, and accept payments through their connected Stripe account. Existing external registration links can stay in place wherever a club prefers them.",
  },
];

const topics = [
  { id: "costs", label: "Costs", title: "Costs & commitment", icon: "cash", indices: [0, 1, 3] },
  { id: "website", label: "Website", title: "Managing your website", icon: "desktop", indices: [2] },
  { id: "registrations", label: "Registrations", title: "Player registrations", icon: "clipboard-text", indices: [4] },
] as const;

const pictures = { costs: CostsPicture, website: WebsitePicture, registrations: RegistrationPicture };

export function Faq() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedTopic = topics[selectedIndex];
  const Picture = pictures[selectedTopic.id];

  return (
    <section className={styles.section} id="faq" aria-labelledby="faq-title">
      <div className={styles.inner}>
        <div className={styles.sidebar}>
          <h2 id="faq-title">Questions clubs ask</h2>
          <p>Costs, what&apos;s included, and what your staff can change themselves.</p>
          <div className={styles.topics} role="group" aria-label="FAQ topics">
            {topics.map((topic, index) => (
              <button
                key={topic.id}
                type="button"
                aria-pressed={index === selectedIndex}
                aria-controls="faq-topic-questions"
                onClick={() => setSelectedIndex(index)}
              >
                <span
                  className={styles.icon}
                  aria-hidden="true"
                  style={{ "--faq-icon": `url('/icons/faq/${topic.icon}.svg')` } as CSSProperties}
                />
                {topic.label}
              </button>
            ))}
          </div>
          <Picture key={selectedTopic.id} />
        </div>
        <div className={styles.content} id="faq-topic-questions" key={selectedTopic.id}>
          <h3>{selectedTopic.title}</h3>
          <Accordion indices={selectedTopic.indices} />
          <p className={styles.hint}>Choose another topic to explore more questions.</p>
        </div>
      </div>
    </section>
  );
}

/**
 * One question open at a time. The list flows in once it is in view (and again
 * on each topic, since a topic mounts a fresh list): pills arrive from
 * alternating sides, blurred, and settle. Opening grows the pill, fades the
 * answer in and turns the + into an x.
 */
function Accordion({ indices }: { indices: readonly number[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const [entered, setEntered] = useState(false);
  const list = useRef<HTMLUListElement>(null);
  const id = useId();

  useEffect(() => {
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      // A frame after mount, so the starting positions paint before they move.
      frame = requestAnimationFrame(() => setEntered(true));
      observer.disconnect();
    }, { threshold: 0.2 });
    observer.observe(list.current!);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, []);

  return (
    <ul className={styles.list} ref={list} data-in={entered || undefined}>
      {indices.map((itemIndex, i) => {
        const item = items[itemIndex];
        const isOpen = open === i;
        return (
          <li key={item.question} className={styles.item} data-open={isOpen || undefined} style={{ "--i": i } as CSSProperties}>
            <h4 className={styles.heading}>
              <button
                type="button"
                id={`${id}-q${i}`}
                className={styles.trigger}
                aria-expanded={isOpen}
                aria-controls={`${id}-a${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span>{item.question}</span>
                <span className={styles.plus} aria-hidden="true" />
              </button>
            </h4>
            <div id={`${id}-a${i}`} role="region" aria-labelledby={`${id}-q${i}`} className={styles.panel} inert={!isOpen}>
              <div className={styles.panelInner}><p>{item.answer}</p></div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
