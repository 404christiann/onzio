"use client";

import { useState, type CSSProperties } from "react";
import styles from "./faq.module.css";

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
    answer: "Yes. Clubs can create native registration forms, collect participant details and waivers, and accept payments through their connected Stripe account. Existing external registration links can stay in place wherever a club prefers them.",
  },
];

const topics = [
  { id: "costs", label: "Costs", title: "Costs & commitment", icon: "cash", indices: [0, 1, 2, 4] },
  { id: "website", label: "Website", title: "Managing your website", icon: "desktop", indices: [3] },
  { id: "registrations", label: "Registrations", title: "Player registrations", icon: "clipboard-text", indices: [5] },
] as const;

export function Faq() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedTopic = topics[selectedIndex];

  return (
    <section className={styles.section} id="faq" aria-labelledby="faq-title">
      <div className={styles.inner}>
        <div className={styles.sidebar}>
          <h2 id="faq-title">Common questions</h2>
          <p>What clubs usually want to know before starting with Onzio.</p>
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
        </div>
        <div className={styles.content} id="faq-topic-questions" key={selectedTopic.id}>
          <h3>{selectedTopic.title}</h3>
          {selectedTopic.indices.map((itemIndex, index) => (
            <details className={styles.question} name={`faq-${selectedTopic.id}`} open={index === 0} key={items[itemIndex].question}>
              <summary>
                <span>{items[itemIndex].question}</span>
                <span className={styles.toggle} aria-hidden="true" />
              </summary>
              <p>{items[itemIndex].answer}</p>
            </details>
          ))}
          <p className={styles.hint}>Choose another topic to explore more questions.</p>
        </div>
      </div>
    </section>
  );
}
