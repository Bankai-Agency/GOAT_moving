/**
 * FAQ data — imported by both FAQClient (UI) and page.tsx (FAQPage schema).
 * Keeping one source of truth guarantees schema never drifts from rendered content.
 */

export type FAQ = { question: string; answer: string };

export type FAQCategory = {
  id: string;
  label: string;
  faqs: FAQ[];
};

export const faqCategories: FAQCategory[] = [
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
    label: "Moving Day",
    faqs: [
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

/** Flattened list for FAQPage schema. */
export const allFaqs: FAQ[] = faqCategories.flatMap((c) => c.faqs);
