"use client";
// FAQ page v2
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { ContactFooter } from "@/components/sections/ContactFooter";
import { Touchbar } from "@/components/layout/Touchbar";
import { QuoteModal } from "@/components/ui/QuoteModal";
import { faqCategories as categories } from "./faqData";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

/* ── SVG icons (same as homepage FAQSection) ── */
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

/* ── FAQ item card (exact copy of homepage design) ── */
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
    <div className="bg-[#181818] rounded-lg lg:rounded-2xl overflow-hidden">
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

/* ── Categories data is sourced from ./faqData.ts (shared with page-level FAQPage schema). ── */

/* ── Hero ── */
function FAQHero() {
  return (
    <section className="relative bg-[#0c0c0c] overflow-hidden">
      <div className="max-w-[1408px] mx-auto px-4 pt-6 lg:pt-10 pb-[40px] lg:pb-[60px]">
        <h1 className="font-sans font-bold text-[36px] lg:text-[64px] leading-[1.1] tracking-[-1.44px] lg:tracking-[-2.56px]">
          <span className="text-[#FFE533]">Frequently Asked </span>
          <span className="text-white">Questions</span>
        </h1>
      </div>
    </section>
  );
}

/* ── Main FAQ section with tabs ── */
function FAQContent() {
  const [activeCategory, setActiveCategory] = useState("general");
  const [openIndex, setOpenIndex] = useState(-1);

  const currentCategory = categories.find((c) => c.id === activeCategory)!;

  const handleCategoryChange = (id: string) => {
    setActiveCategory(id);
    setOpenIndex(-1);
  };

  return (
    <section className="bg-[#0c0c0c] px-4 pb-[60px] lg:pb-[100px]">
      <div className="max-w-[1408px] mx-auto flex flex-col gap-8 lg:gap-12">
        {/* Tabs */}
        <div className="flex flex-nowrap lg:flex-wrap gap-2 lg:gap-3 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-4 py-2.5 lg:px-5 lg:py-3 rounded-lg lg:rounded-xl text-sm lg:text-base font-mono font-bold uppercase tracking-[-0.28px] lg:tracking-[-0.32px] transition-all duration-200 cursor-pointer whitespace-nowrap ${
                activeCategory === cat.id
                  ? "bg-[#FFE533] text-black"
                  : "bg-[#181818] text-white/50 hover:text-white/70 hover:bg-[#1c1c1c]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ cards */}
        <div className="flex flex-col gap-3 lg:gap-4">
          {currentCategory.faqs.map((faq, i) => (
            <FAQItem
              key={`${activeCategory}-${i}`}
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

/* ── Export ── */
export default function FAQClient() {
  return (
    <div className="page-zoom min-h-screen bg-[#0c0c0c]">
      <Header />
      <main>
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "FAQ" }]} />
        <FAQHero />
        <FAQContent />
      </main>
      <ContactFooter />
      <Touchbar />
      <QuoteModal />
    </div>
  );
}
