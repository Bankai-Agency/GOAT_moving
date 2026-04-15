"use client";
// FAQ page v2
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { ContactFooter } from "@/components/sections/ContactFooter";
import { Touchbar } from "@/components/layout/Touchbar";
import { QuoteModal } from "@/components/ui/QuoteModal";

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

/* ── Categories data ── */
const categories = [
  {
    id: "general",
    label: "General Moving",
    faqs: [
      { question: "How much does a local move cost?", answer: "Our local moving rate is $125/hour with a 3-hour minimum. Most studio or 1-bedroom moves take 2\u20133 hours, while a 2\u20133 bedroom home typically takes 4\u20136 hours. No charge for stairs or standard equipment." },
      { question: "How far in advance should I book?", answer: "We recommend booking at least 1\u20132 weeks in advance, especially during peak moving season (May\u2013September). Last-minute moves may be available depending on our schedule." },
      { question: "Do you move on weekends and holidays?", answer: "Yes, we offer moves 7 days a week including weekends. Holiday availability may vary \u2014 contact us to check scheduling." },
      { question: "What areas do you serve?", answer: "We\u2019re based in Vancouver, WA and serve the entire Portland\u2013Vancouver metro area, including Beaverton, Hillsboro, Tigard, Gresham, Lake Oswego, and beyond." },
      { question: "Are you licensed and insured?", answer: "Yes. GOAT Movers is fully licensed (USDOT #4232069, MC #1637475) and insured. We hold active interstate authority through FMCSA." },
    ],
  },
  {
    id: "moving-day",
    label: "Moving Day",    faqs: [
      { question: "How long does a typical move take?", answer: "A studio or 1-bedroom usually takes 2\u20133 hours, a 2\u20133 bedroom home takes 4\u20136 hours. Larger homes may take a full day. We\u2019ll give you a time estimate when you book." },
      { question: "Do I need to be present during the move?", answer: "We recommend being present at the start and end of the move to walk through any special instructions. If you can\u2019t be there, you can designate a representative." },
      { question: "Do you disassemble and reassemble furniture?", answer: "Yes \u2014 basic furniture disassembly and reassembly (bed frames, tables, shelving) is included at no extra charge." },
      { question: "How do you protect furniture and fragile items?", answer: "We use professional moving blankets, shrink wrap, and straps for all furniture. Specialized TV boxes, mattress covers, and custom crating are available for fragile items." },
      { question: "What if something gets damaged during the move?", answer: "All moves include basic cargo coverage. If any item is damaged, report it to our team within 24 hours and we\u2019ll work with you to resolve it promptly." },
    ],
  },
  {
    id: "pricing",
    label: "Pricing & Payment",
    faqs: [
      { question: "What\u2019s included in the hourly rate?", answer: "The moving truck, fuel, all equipment (dollies, blankets, straps), and our professional movers. No hidden fees or surprise charges." },
      { question: "Do you charge for travel time?", answer: "Travel time is billed at our standard hourly rate from our location to your pickup and back. We\u2019re transparent about this \u2014 no hidden surcharges." },
      { question: "What payment methods do you accept?", answer: "We accept cash, credit/debit cards, Venmo, Zelle, and CashApp. Payment is collected at the end of the move." },
      { question: "Is there a deposit required?", answer: "For local moves, no deposit is needed. Long-distance moves require a deposit to secure your date, which is applied to your final balance." },
      { question: "Do you offer free estimates?", answer: "Yes! Contact us with your move details and we\u2019ll provide a free, no-obligation estimate. For the most accurate quote, we may ask about inventory size and distance." },
    ],
  },
  {
    id: "services",
    label: "Services & Coverage",
    faqs: [
      { question: "Do you offer packing services?", answer: "Yes. Professional packing is available as an add-on. We provide tape, shrink wrap, mattress covers, and boxes. You\u2019re also welcome to use your own materials." },
      { question: "Do you handle long-distance moves?", answer: "Yes. We\u2019re licensed for interstate moves and handle long-distance relocations from the Pacific Northwest to destinations across the US." },
      { question: "Can you move specialty items like pianos or safes?", answer: "Yes, we have experience with heavy and specialty items including pianos, safes, and large appliances. Let us know in advance so we can plan accordingly." },
      { question: "Do you offer storage solutions?", answer: "We can coordinate short-term storage through our partner facilities. Contact us for details and availability." },
      { question: "Do you move commercial or office spaces?", answer: "Yes, we offer commercial moving services for offices and businesses. Weekend and after-hours moves are available to minimize disruption." },
    ],
  },
  {
    id: "insurance",
    label: "Insurance & Protection",
    faqs: [
      { question: "What kind of insurance do you carry?", answer: "We carry full liability insurance and cargo coverage. Every move is protected from start to finish." },
      { question: "What does basic cargo coverage include?", answer: "Basic coverage is included with every move at no additional cost. It provides protection based on the weight of the item." },
      { question: "Can I purchase additional coverage?", answer: "Yes. If you have high-value items, we offer full-value protection options. Ask us about this when booking your move." },
      { question: "How do I file a damage claim?", answer: "Report any damage within 24 hours of your move by contacting our team. We\u2019ll document the issue and work toward a fair resolution as quickly as possible." },
      { question: "Are my belongings covered during loading and transport?", answer: "Yes \u2014 your items are covered from the moment we load them until they\u2019re placed in your new home. Our movers use protective equipment on every job." },
    ],
  },
];

/* ── Hero ── */
function FAQHero() {
  return (
    <section className="relative bg-[#0c0c0c] overflow-hidden">
      <div className="max-w-[1408px] mx-auto px-4 pt-[140px] lg:pt-[180px] pb-[40px] lg:pb-[60px]">
        <h1 className="font-sans font-bold text-[36px] lg:text-[64px] leading-[1.1] tracking-[-1.44px] lg:tracking-[-2.56px]">
          <span className="text-white/60">Frequently Asked </span>
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
    <div className="min-h-screen bg-[#0c0c0c]">
      <Header />
      <FAQHero />
      <FAQContent />
      <ContactFooter />
      <Touchbar />
      <QuoteModal />
    </div>
  );
}
