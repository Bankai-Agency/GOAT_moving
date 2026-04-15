"use client";

import { useState } from "react";

export type FAQItemData = {
  question: string;
  answer: string;
};

export type FAQSectionProps = {
  label?: string;
  title?: string;
  items?: FAQItemData[];
};

const defaultItems: FAQItemData[] = [
  {
    question: "How much does a local move cost in Vancouver, WA?",
    answer:
      "Our rate is $125/hour. Most studio or 1-bedroom moves take 2-3 hours, a 2-3 bedroom home takes 4-6 hours. 3-hour minimum for all moves. No charge for stairs.",
  },
  {
    question: "How long does a move take?",
    answer:
      "It depends on the size: a studio or 1-bedroom typically takes 2-3 hours, a 2-3 bedroom home 4-6 hours. Larger moves may take a full day.",
  },
  {
    question: "What\u2019s included in the hourly rate?",
    answer:
      "The moving truck, fuel, all equipment (dollies, blankets, straps), and our professional movers. No hidden fees.",
  },
  {
    question: "Do you serve Portland, OR?",
    answer:
      "Yes. We\u2019re based in Vancouver, WA and serve the entire Portland metro \u2014 including Beaverton, Hillsboro, Tigard, and Gresham.",
  },
  {
    question: "Do you offer packing services?",
    answer:
      "Yes. Tape, shrink wrap, mattress covers, and boxes are available at additional cost. You\u2019re welcome to use your own materials.",
  },
  {
    question: "Do you disassemble and reassemble furniture?",
    answer:
      "Yes \u2014 bed frames and basic furniture disassembly/reassembly is included at no extra charge.",
  },
  {
    question: "Are you licensed and insured?",
    answer:
      "Yes. GOAT Movers is fully licensed (USDOT #4232069, MC #1637475) and insured. Active interstate authority through FMCSA.",
  },
  {
    question: "Do you charge for travel time?",
    answer:
      "Travel time is billed at our standard hourly rate \u2014 from our location to yours and back. No hidden surcharges.",
  },
  {
    question: "How do you protect TVs and electronics?",
    answer:
      "Specialized TV boxes and padding. For large screens, we offer custom crating.",
  },
];

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 0V14M0 7H14" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg width="14" height="2" viewBox="0 0 14 2" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 1H14" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-[#181818] rounded-lg lg:rounded-2xl overflow-hidden faq-item">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-[10px] p-4 lg:p-6 cursor-pointer group"
      >
        <span className="font-sans font-semibold text-xl lg:text-2xl leading-[1.2] tracking-[-0.6px] lg:tracking-[-0.72px] text-white text-left flex-1">
          {question}
        </span>
        <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-[#242424] flex items-center justify-center shrink-0 shadow-[0px_0px_6px_0px_rgba(0,0,0,0.02),0px_2px_4px_0px_rgba(0,0,0,0.08)] transition-all duration-300 ease-out group-hover:scale-110 group-hover:bg-[#2a2a2a]">
          {isOpen ? <MinusIcon /> : <PlusIcon />}
        </div>
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-4 pb-4 lg:px-6 lg:pb-6 font-sans font-normal text-base lg:text-lg leading-[1.5] lg:leading-[1.4] tracking-[-0.48px] lg:tracking-[-0.36px] text-white/60">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FAQSection({
  label = "FAQ",
  title = "Frequently Asked Questions",
  items = defaultItems,
}: FAQSectionProps = {}) {
  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <section id="faq" className="bg-[#0c0c0c] px-4 py-[60px] lg:py-[100px]">
      <div className="max-w-[1408px] mx-auto flex flex-col gap-6 lg:gap-16">
        {/* Section header */}
        <div className="flex flex-col gap-[36px] lg:gap-12">
          {/* Bullet label */}
          <div className="border-b border-white/16 pb-6">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#FFE533]" />
              <span className="font-mono font-bold text-base uppercase tracking-[-0.64px] leading-[1.2] text-white/60">
                {label}
              </span>
            </div>
          </div>

          {/* Desktop: heading + list side-by-side. Mobile: just heading here */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between lg:gap-16">
            <h2 className="font-sans font-bold text-[32px] lg:text-[64px] leading-[1.2] tracking-[-0.96px] lg:tracking-[-2.56px] text-white lg:max-w-[512px] lg:shrink-0">
              {title}
            </h2>

            {/* Desktop accordion (inline with heading) */}
            <div className="hidden lg:flex flex-col gap-5 w-[638px] shrink-0">
              {items.map((faq, i) => (
                <FAQItem
                  key={i}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile accordion (below heading) */}
        <div className="flex flex-col gap-2 w-full lg:hidden">
          {items.map((faq, i) => (
            <FAQItem
              key={i}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
