import { useState } from "react";
import "./FAQ.css";

const faqs = [
  {
    question: "How does TeamUP match me with teammates?",
    answer:
      "TeamUP compares your skills, project interests, and goals to recommend compatible students so you can build faster with the right people.",
  },
  {
    question: "Is TeamUP free for students?",
    answer:
      "Yes. TeamUP is free to join for students and you can create a profile, connect with teammates, and explore opportunities without a paid plan.",
  },
  {
    question: "Can I use TeamUP for hackathons and college projects?",
    answer:
      "Absolutely. You can find teammates for hackathons, semester projects, startup ideas, and other collaborative builds from one platform.",
  },
  {
    question: "Do I need a verified student profile?",
    answer:
      "A verified profile helps build trust and improves matching quality. Verified users are prioritized in teammate discovery and requests.",
  },
  {
    question: "Can I chat before joining a team?",
    answer:
      "Yes, TeamUP includes built-in chat so you can discuss goals, stack, and availability before committing to a team.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="faq-wrapper">
      <div className="faq-header">
        <span className="faq-badge">FAQs</span>
        <h2>
          Questions Before You <span>Start Building?</span>
        </h2>
        <p>
          Everything you need to know before finding teammates on TeamUP.
        </p>
      </div>

      <div className="faq-list">
        {faqs.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <article key={item.question} className={`faq-item ${isOpen ? "open" : ""}`}>
              <button
                type="button"
                className="faq-question"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                aria-expanded={isOpen}
              >
                <span>{item.question}</span>
                <span className="faq-icon">{isOpen ? "-" : "+"}</span>
              </button>
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
