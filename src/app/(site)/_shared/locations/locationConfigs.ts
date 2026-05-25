/**
 * Per-city content for the location-based SEO pages (indexed, not noindex LPs).
 *
 * URL pattern: /{city}-movers
 *   e.g. /vancouver-movers, /portland-movers, /beaverton-movers
 *
 * Copy here intentionally differs from /lp/* landing pages so Google doesn't
 * see duplicate content across the two. Location pages emphasize SEO signal:
 * unique title/H1/description, city name mentioned naturally, local
 * neighborhood keywords, city-tailored FAQs.
 */

export type LocationConfig = {
  /** URL slug under `/`. Example: "vancouver-movers" → `/vancouver-movers`. */
  slug: string;
  /** Short display name (e.g. "Vancouver"). */
  city: string;
  /** Full display name sometimes needed in copy ("Vancouver, WA"). */
  cityDisplay: string;
  /** Two-letter state code. */
  state: "OR" | "WA";
  /** Full state name for license/insurance copy. */
  stateLong: "Oregon" | "Washington";
  /** Public path to hero background image. */
  heroImage: string;
  /** Optional mobile object-position override. */
  heroImagePosition?: string;

  /* ─── Metadata (SEO) ─── */
  metaTitle: string;
  metaDescription: string;
  keywords: string[];

  /* ─── Hero ─── */
  heroEyebrow: string;
  h1Highlight: string; // highlighted city/region phrase in H1 (yellow)
  h1Suffix: string;    // the remaining H1 line after the highlight
  heroSubtitle: string;

  /* ─── Our Services section ─── */
  servicesSubtitle: string;
  localMovingDescription: string;
  longDistanceDescription?: string;
  commercialDescription?: string;
  packingDescription?: string;

  /* ─── Why GOAT section ─── */
  whyTitle: string;
  whyDescription: string;

  /* ─── What's Included ─── */
  whatsIncludedSubtitle: string;

  /* ─── CTA Banner ─── */
  ctaHeading: string;
  ctaTagline: string;

  /* ─── FAQ (6 city-specific) ─── */
  faqs: { question: string; answer: string }[];
};

/* ---------------------- Common helper ---------------------- */

const standardAnswers = {
  pricing:
    "$125 per hour for a two-mover crew plus a truck, with a three-hour minimum. Most local moves land between $400 and $900 depending on home size, stairs, and distance.",
  booking:
    "Five to seven days in advance is comfortable, especially May–September. We take last-minute bookings when our schedule allows — call us at (380) 524-0846 to check same-week availability.",
  insurance:
    "Yes. Fully licensed and insured with USDOT #4232069 and $1M liability coverage. A certificate of insurance (COI) is available on request for apartment buildings and commercial leases.",
};


/* ---------------------- Cities ---------------------- */

export const locationConfigs: LocationConfig[] = [
  /* ============================== VANCOUVER, WA ============================== */
  {
    slug: "vancouver-movers",
    city: "Vancouver",
    cityDisplay: "Vancouver, WA",
    state: "WA",
    stateLong: "Washington",
    heroImage: "/images/location-vancouver.jpg",
    heroImagePosition: "object-[25%_center]",
    metaTitle: "Vancouver WA Movers — Local, Long Distance & Commercial",
    metaDescription:
      "Professional movers in Vancouver, WA. Licensed in both WA and OR for cross-river moves to Portland. $125/hr local, no hidden fees. 500+ Vancouver moves completed.",
    keywords: [
      "Vancouver WA movers",
      "Vancouver Washington moving company",
      "Vancouver to Portland movers",
      "Mill Plain movers",
      "Salmon Creek movers",
      "Felida movers",
      "cross-river movers",
    ],
    heroEyebrow: "Vancouver, WA",
    h1Highlight: "Vancouver, WA",
    h1Suffix: "Movers — Cross-River to Portland Without the Chaos",
    heroSubtitle:
      "We live on both sides of the Columbia. Local moves in Vancouver, apartment complexes in Mill Plain, Salmon Creek homes, cross-river to Portland — one transparent price, licensed in both states.",
    servicesSubtitle:
      "From studios near Downtown Vancouver to full 3-bedroom moves in Felida and Salmon Creek, we run every stage of your relocation — no sub-contractors, no surprises.",
    localMovingDescription:
      "Residential local moves anywhere in Vancouver, WA — Downtown, Mill Plain, Salmon Creek, Felida, Hazel Dell, Fisher's Landing, Cascade Park. $125/hour flat, no stair surcharges, no mileage fees within the metro.",
    longDistanceDescription:
      "Interstate moves out of Vancouver with federal authority (USDOT #4232069). Cross-state to California, Idaho, Arizona — same crew loads and delivers, no warehouse transfers.",
    commercialDescription:
      "Office relocations in Vancouver and the Portland metro. After-hours and weekend scheduling, IT equipment specialists, COI provided for your property manager.",
    whyTitle: "Why Vancouver Chooses GOAT Movers",
    whyDescription:
      "Vancouver movers need to work both sides of the Columbia. We're licensed in both WA and OR (not a given for most local crews), know every apartment complex off Mill Plain, every HOA in Felida, and how to time I-5 bridge traffic so your move doesn't eat an extra two hours in fuel.",
    whatsIncludedSubtitle:
      "Every Vancouver move — whether it's across the block or across the Columbia — includes the same checklist of essentials.",
    ctaHeading: "Get Your Exact Vancouver, WA Moving Price in 30 Seconds",
    ctaTagline: "No hidden fees. No bridge surcharges. Licensed in both WA and OR.",
    faqs: [
      { question: "How much do movers cost in Vancouver, WA?", answer: standardAnswers.pricing },
      {
        question: "Do you charge extra for cross-river moves between Vancouver, WA and Portland, OR?",
        answer:
          "No. Cross-river moves are one of our most common jobs — no bridge tolls, no border surcharges. Same transparent hourly rate on both sides.",
      },
      {
        question: "Are you licensed and insured in Washington?",
        answer: standardAnswers.insurance,
      },
      {
        question: "Do you serve Salmon Creek, Felida, and the north Vancouver suburbs?",
        answer:
          "Yes. Every Vancouver neighborhood from Downtown to Fisher's Landing and Salmon Creek is inside our standard service area at the same hourly rate.",
      },
      {
        question: "Can you handle apartment complexes with strict move-in windows?",
        answer:
          "Yes. We coordinate elevator reservations, loading docks, and provide a Certificate of Insurance to the property manager ahead of the move.",
      },
      {
        question: "How far in advance should I book a Vancouver, WA move?",
        answer: standardAnswers.booking,
      },
    ],
  },

  /* ============================== PORTLAND, OR ============================== */
  {
    slug: "portland-movers",
    city: "Portland",
    cityDisplay: "Portland, OR",
    state: "OR",
    stateLong: "Oregon",
    heroImage: "/images/location-portland.jpg",
    heroImagePosition: "object-[25%_center]",
    metaTitle: "Portland OR Movers — Stress-Free Residential & Commercial",
    metaDescription:
      "Portland movers who actually show up on time. $125/hr flat, no hidden fees. Pearl District high-rises, Northwest walk-ups, Sellwood houses — we handle it all. 500+ Portland moves.",
    keywords: [
      "Portland OR movers",
      "Portland moving company",
      "Pearl District movers",
      "Northwest Portland movers",
      "Sellwood movers",
      "Hawthorne movers",
      "Portland apartment movers",
    ],
    heroEyebrow: "Portland, OR",
    h1Highlight: "Portland, OR",
    h1Suffix: "Movers — On Time, No Hidden Fees, No Drama",
    heroSubtitle:
      "Local Portland crew that knows every Pearl District loading dock, every Northwest walk-up stair count, and how to time a Sellwood move around rush hour. Licensed, insured, $125/hour flat.",
    servicesSubtitle:
      "Residential, commercial, long-distance, packing — everything a Portland move needs, handled by one crew with one quote.",
    localMovingDescription:
      "Local Portland moves across every neighborhood — Pearl District, Northwest, Downtown, Sellwood, Hawthorne, St. Johns, Alberta, Laurelhurst. Flat $125 per hour, no stair fees, no long-carry surcharges.",
    longDistanceDescription:
      "Portland-based long distance moves across the US. Fully FMCSA-licensed (USDOT #4232069). Dedicated truck, one crew loads and unloads — no warehouse reshuffling.",
    commercialDescription:
      "Commercial moves in downtown Portland, Lloyd District, and Pearl. After-hours and weekend scheduling so your business doesn't lose a weekday.",
    whyTitle: "Why Portland Hires GOAT Movers",
    whyDescription:
      "Portland has narrow streets, tight garages, 1920s staircases, Pearl District service elevators with 90-minute windows, and Sunday morning MAX trains that block your truck. We've worked all of it. When we quote your move we already know whether your building needs a COI and how long it'll actually take — not a best-case estimate.",
    whatsIncludedSubtitle:
      "Every Portland move includes the same base package — truck, fuel, tools, crew, protection — so your quote is the price you pay.",
    ctaHeading: "Get Your Exact Portland Moving Price in 30 Seconds",
    ctaTagline: "No hidden fees. No stair surcharges. Licensed in Oregon, insured for every move.",
    faqs: [
      { question: "How much do movers cost in Portland, OR?", answer: standardAnswers.pricing },
      {
        question: "Do you handle Pearl District high-rises and service elevators?",
        answer:
          "Yes. We regularly book elevator reservations, provide COI to building management, and plan crew size around the actual window you get on the dock.",
      },
      {
        question: "Are you licensed and insured in Oregon?",
        answer: standardAnswers.insurance,
      },
      {
        question: "Do you charge extra for stairs or walk-ups in Northwest Portland?",
        answer:
          "No. Stair carries are included in the hourly rate — no per-flight surcharges, no separate long-carry fee for the extra block you parked down the street.",
      },
      {
        question: "Can you move between Portland and Vancouver, WA the same day?",
        answer:
          "Yes. Cross-river Portland ↔ Vancouver moves are one of our most common routes — no bridge tolls added, same transparent pricing on both sides of the Columbia.",
      },
      {
        question: "How far in advance should I book?",
        answer: standardAnswers.booking,
      },
    ],
  },

  /* ============================== BEAVERTON, OR ============================== */
  {
    slug: "beaverton-movers",
    city: "Beaverton",
    cityDisplay: "Beaverton, OR",
    state: "OR",
    stateLong: "Oregon",
    heroImage: "/images/location-beaverton.jpg",
    metaTitle: "Beaverton OR Movers — Tech Relocations & Family Homes",
    metaDescription:
      "Beaverton movers for Nike HQ, Cedar Hills, and Progress Ridge neighborhoods. $125/hr, no hidden fees, trusted by 500+ Washington County families. Free moving quote.",
    keywords: [
      "Beaverton OR movers",
      "Beaverton moving company",
      "Washington County movers",
      "Cedar Hills movers",
      "Progress Ridge movers",
      "Nike HQ movers",
      "Beaverton apartment movers",
    ],
    heroEyebrow: "Beaverton, OR",
    h1Highlight: "Beaverton",
    h1Suffix: "Movers — Tech Relocations & Suburban Homes, Done Right",
    heroSubtitle:
      "Moving to or from Beaverton's tech corridor? We handle Nike HQ transfers, Cedar Hills family homes, and Progress Ridge condos at a flat $125 per hour — no Westside surcharge, no highway-traffic padding.",
    servicesSubtitle:
      "Serving all of Beaverton, the Westside Tech Corridor, and Washington County — licensed, insured, predictable.",
    localMovingDescription:
      "Local Beaverton moves across Cedar Hills, Progress Ridge, Raleigh Hills, Aloha, and the downtown core. Hourly pricing with everything included — truck, fuel, equipment, packing materials on demand.",
    longDistanceDescription:
      "Long-distance moves out of Beaverton for tech relocations, including out-of-state Nike, Intel, and Tektronix transfers. FMCSA-licensed with same-crew delivery.",
    commercialDescription:
      "Office relocations for Beaverton tech, engineering, and professional firms. Weekend and evening scheduling so workstations are live by Monday.",
    whyTitle: "Why Beaverton Professionals Choose GOAT",
    whyDescription:
      "Beaverton move logistics are their own thing: Westside MAX schedules, Highway 26 bottlenecks, gated communities in Cedar Hills, condo HOAs in Progress Ridge. We quote based on real drive-time data from actual jobs — not a flat 'Portland metro' rate — so your estimate matches reality.",
    whatsIncludedSubtitle:
      "Beaverton move rate includes truck, fuel, tools, padding, basic disassembly, and a crew that's seen every type of home in Washington County.",
    ctaHeading: "Get Your Exact Beaverton Moving Price in 30 Seconds",
    ctaTagline: "No Westside surcharge. No hidden fees. Licensed, insured, on-time.",
    faqs: [
      { question: "How much do movers cost in Beaverton, OR?", answer: standardAnswers.pricing },
      {
        question: "Do you handle moves from Nike HQ, Intel, or other Westside tech campuses?",
        answer:
          "Yes — tech relocations are a big part of our Beaverton work. We coordinate with HR/relocation coordinators, handle out-of-state transfers under our FMCSA authority, and have working protocols for IT/hardware transport.",
      },
      {
        question: "Do you charge extra because Beaverton is on the Westside?",
        answer:
          "No. The same hourly rate applies whether you're moving within Beaverton, to Portland, or to Tualatin. No 'Westside surcharge,' no mileage fees inside the metro.",
      },
      {
        question: "Can you handle Progress Ridge condos and gated communities in Cedar Hills?",
        answer:
          "Yes. We call ahead to gate entrances, submit COI to the HOA, and plan truck parking around any access restrictions so there are no day-of surprises.",
      },
      {
        question: "Are you licensed and insured in Oregon?",
        answer: standardAnswers.insurance,
      },
      {
        question: "How far in advance should I book a Beaverton move?",
        answer: standardAnswers.booking,
      },
    ],
  },

  /* ============================== HILLSBORO, OR ============================== */
  {
    slug: "hillsboro-movers",
    city: "Hillsboro",
    cityDisplay: "Hillsboro, OR",
    state: "OR",
    stateLong: "Oregon",
    heroImage: "/images/location-hillsboro.jpg",
    heroImagePosition: "object-[25%_center]",
    metaTitle: "Hillsboro OR Movers — Silicon Forest & Orenco Station",
    metaDescription:
      "Moving in or out of Hillsboro? We handle Intel Ronler Acres relocations, Orenco Station townhomes, and Tanasbourne apartments. $125/hr local, licensed, insured.",
    keywords: [
      "Hillsboro OR movers",
      "Hillsboro moving company",
      "Intel movers",
      "Orenco Station movers",
      "Tanasbourne movers",
      "AmberGlen movers",
      "Silicon Forest movers",
    ],
    heroEyebrow: "Hillsboro, OR",
    h1Highlight: "Hillsboro",
    h1Suffix: "Movers — Silicon Forest Relocations Handled",
    heroSubtitle:
      "Intel transfer? Orenco Station move? New build out in Witch Hazel? We run 20+ Hillsboro moves every month — Silicon Forest relocations, Tanasbourne apartments, AmberGlen condos — all at $125 flat per hour.",
    servicesSubtitle:
      "Full moving services across every Hillsboro neighborhood — no 'Westside drive' fee, no sub-contractors, no surprises on the day.",
    localMovingDescription:
      "Local Hillsboro moves across Orenco Station, Tanasbourne, AmberGlen, Aloha, Witch Hazel, Reedville, and Bethany. Every move priced hourly with truck, fuel, and equipment included.",
    longDistanceDescription:
      "Interstate relocations for Intel, Genentech, and Nike West Campus transferees. Same-crew delivery with FMCSA authority — no warehouse hand-off, no lost boxes.",
    commercialDescription:
      "Commercial moves for Hillsboro's Silicon Forest tech sector. After-hours and weekend service, IT equipment specialists, secure-document handling on request.",
    whyTitle: "Why Hillsboro Families and Tech Workers Pick GOAT",
    whyDescription:
      "We know Intel's relocation cadence, how Orenco Station's narrow lanes affect truck staging, and why Tanasbourne apartment complexes demand a certificate of insurance 48 hours early. Working in Hillsboro daily, we plan around local realities — not a generic Portland-metro schedule.",
    whatsIncludedSubtitle:
      "Every Hillsboro move includes our full service package — truck, crew, materials, protection — for one transparent hourly rate.",
    ctaHeading: "Get Your Exact Hillsboro Moving Price in 30 Seconds",
    ctaTagline: "No Silicon Forest surcharge. No hidden fees. Licensed and insured.",
    faqs: [
      { question: "How much do movers cost in Hillsboro, OR?", answer: standardAnswers.pricing },
      {
        question: "Do you handle Intel relocations out of Ronler Acres or Jones Farm?",
        answer:
          "Yes. Intel and other tech relocations are a large portion of our Hillsboro work. We coordinate with HR relocation packages and can handle both the household move and any out-of-state transfer under our interstate authority.",
      },
      {
        question: "Do you charge extra for driving out to Hillsboro from Portland?",
        answer:
          "No. Hillsboro is part of our core service area — same hourly rate as Portland and Beaverton, no 'far Westside' fee.",
      },
      {
        question: "Can you handle Orenco Station townhomes and narrow driveways?",
        answer:
          "Yes. Orenco's driveway and alley layouts are tricky — we stage trucks, shuttle with dollies where needed, and bring smaller trucks for new-construction alleys when the 26-footer won't fit.",
      },
      {
        question: "Are you licensed and insured in Oregon?",
        answer: standardAnswers.insurance,
      },
      {
        question: "How far in advance should I book?",
        answer: standardAnswers.booking,
      },
    ],
  },

  /* ============================== TIGARD, OR ============================== */
  {
    slug: "tigard-movers",
    city: "Tigard",
    cityDisplay: "Tigard, OR",
    state: "OR",
    stateLong: "Oregon",
    heroImage: "/images/location-tigard.jpg",
    heroImagePosition: "object-[25%_center]",
    metaTitle: "Tigard OR Movers — Bridgeport, Bull Mountain & Metzger",
    metaDescription:
      "Professional Tigard movers. Bridgeport apartments, Bull Mountain homes, Metzger townhouses — all at $125/hr flat with no 99W or I-5 traffic surcharge. Free quote.",
    keywords: [
      "Tigard OR movers",
      "Tigard moving company",
      "Bridgeport Village movers",
      "Bull Mountain movers",
      "Metzger movers",
      "Summerfield movers",
      "Tigard apartment movers",
    ],
    heroEyebrow: "Tigard, OR",
    h1Highlight: "Tigard",
    h1Suffix: "Movers — Bridgeport, Bull Mountain & the Whole 99W Corridor",
    heroSubtitle:
      "Local Tigard crew familiar with every apartment complex around Bridgeport, the hillside roads in Bull Mountain, and the quickest truck routes through 99W rush hour. Transparent pricing, no I-5 traffic surcharge.",
    servicesSubtitle:
      "Full residential and commercial moving service across Tigard, King City, Durham, and Tualatin Valley — licensed, insured, flat-rate.",
    localMovingDescription:
      "Local Tigard moves to and from Bridgeport, Downtown Tigard, Bull Mountain, Metzger, Summerfield, and King City. Flat hourly pricing — no extra fees for Bull Mountain hillside driveways or multi-level homes.",
    longDistanceDescription:
      "Out-of-state moves from Tigard across the Pacific Northwest and beyond. Licensed interstate carrier (USDOT #4232069), dedicated crew, no warehouse layovers.",
    commercialDescription:
      "Office moves for Tigard's professional services and medical offices. Evening and weekend scheduling available for minimum downtime.",
    whyTitle: "Why Tigard Residents Pick GOAT",
    whyDescription:
      "Tigard moves mean managing 99W traffic, hillside drives up Bull Mountain, and apartment complexes near Bridgeport that require detailed loading-dock scheduling. We route trucks based on actual time-of-day traffic patterns and come prepared for the specific quirks of every Tigard neighborhood.",
    whatsIncludedSubtitle:
      "Every Tigard move comes with truck, fuel, equipment, furniture protection, and basic disassembly for one flat hourly rate.",
    ctaHeading: "Get Your Exact Tigard Moving Price in 30 Seconds",
    ctaTagline: "No 99W traffic surcharge. No hidden fees. Flat $125 per hour.",
    faqs: [
      { question: "How much do movers cost in Tigard, OR?", answer: standardAnswers.pricing },
      {
        question: "Can you handle apartment complexes around Bridgeport Village?",
        answer:
          "Yes. We coordinate elevator reservations, loading zones, and COI delivery for every major Bridgeport-area complex. Most buildings we've worked before — so we know their rules already.",
      },
      {
        question: "Do you charge extra for Bull Mountain hillside driveways?",
        answer:
          "No. Steep or narrow driveways are handled within the hourly rate. We'll shuttle with a smaller truck or dolly where the main truck can't access safely — no extra fee.",
      },
      {
        question: "Can you avoid 99W and I-5 rush hours?",
        answer:
          "Yes. We plan your move window around Tigard's traffic patterns. Morning moves are usually ideal for Bridgeport and Metzger; Bull Mountain is easier in midday.",
      },
      {
        question: "Are you licensed and insured in Oregon?",
        answer: standardAnswers.insurance,
      },
      {
        question: "How far in advance should I book?",
        answer: standardAnswers.booking,
      },
    ],
  },

  /* ============================== TUALATIN, OR ============================== */
  {
    slug: "tualatin-movers",
    city: "Tualatin",
    cityDisplay: "Tualatin, OR",
    state: "OR",
    stateLong: "Oregon",
    heroImage: "/images/location-tualatin.jpg",
    metaTitle: "Tualatin OR Movers — Nyberg, Tualatin Valley & Sherwood Line",
    metaDescription:
      "Moving in Tualatin, OR? Local movers for Nyberg neighborhoods, Tualatin Country Club homes, and apartments near Bridgeport. $125/hr flat, licensed, insured.",
    keywords: [
      "Tualatin OR movers",
      "Tualatin moving company",
      "Nyberg movers",
      "Tualatin Country Club movers",
      "Sherwood line movers",
    ],
    heroEyebrow: "Tualatin, OR",
    h1Highlight: "Tualatin",
    h1Suffix: "Movers — From Nyberg Condos to Country Club Homes",
    heroSubtitle:
      "Local Tualatin crew for every type of move — Nyberg apartments, Tualatin Country Club family homes, new builds along the Sherwood line. $125 flat per hour with full licensing and insurance.",
    servicesSubtitle:
      "Residential, commercial, and packing service across Tualatin, King City, and the south Washington County corridor.",
    localMovingDescription:
      "Local Tualatin moves across Nyberg, Tualatin Country Club, Ibach, and the suburbs bordering Sherwood. Flat hourly pricing with truck, equipment, and crew all included.",
    longDistanceDescription:
      "Interstate moves out of Tualatin. FMCSA carrier with same-crew door-to-door delivery, transparent pricing built around your specific route and timeline.",
    commercialDescription:
      "Office relocations for Tualatin business parks and professional services. Evening and weekend scheduling for minimum disruption.",
    whyTitle: "Why Tualatin Families Trust GOAT",
    whyDescription:
      "Tualatin sits at the south end of Washington County's tech corridor — upper-middle family homes, country club estates, and apartments that need coordinated loading. We work the area weekly, know which Tualatin complexes require COI, and have moved every type of home here from 1,200-sq-ft condos to 4-bedroom custom builds.",
    whatsIncludedSubtitle:
      "Every Tualatin move includes a full crew, truck, fuel, pads, dollies, straps, and basic furniture disassembly for one hourly rate.",
    ctaHeading: "Get Your Exact Tualatin Moving Price in 30 Seconds",
    ctaTagline: "No south-metro surcharge. No hidden fees. Flat $125 per hour.",
    faqs: [
      { question: "How much do movers cost in Tualatin, OR?", answer: standardAnswers.pricing },
      {
        question: "Do you serve Tualatin Country Club neighborhoods?",
        answer:
          "Yes. Tualatin Country Club family homes are common for us — we handle HOA gate coordination, long driveway access, and specialty item handling (pianos, pool tables, antiques) in-house.",
      },
      {
        question: "Do you charge extra to come to Tualatin from Portland?",
        answer:
          "No. Tualatin is part of our core service area at the same hourly rate as Portland or Beaverton. No south-metro mileage fee.",
      },
      {
        question: "Can you handle moves across the Sherwood line?",
        answer:
          "Yes. Tualatin ↔ Sherwood moves are regular for us. Same hourly pricing whether it's a cross-town move or a short hop to the next city.",
      },
      {
        question: "Are you licensed and insured in Oregon?",
        answer: standardAnswers.insurance,
      },
      {
        question: "How far in advance should I book?",
        answer: standardAnswers.booking,
      },
    ],
  },

  /* ============================== CAMAS, WA ============================== */
  {
    slug: "camas-movers",
    city: "Camas",
    cityDisplay: "Camas, WA",
    state: "WA",
    stateLong: "Washington",
    heroImage: "/images/location-camas.jpg",
    metaTitle: "Camas WA Movers — Grass Valley, Prune Hill & Downtown",
    metaDescription:
      "Camas, WA movers serving Prune Hill, Grass Valley, and Downtown. Cross-state licensed for Portland-area moves. $125/hr flat, no hidden fees, licensed & insured.",
    keywords: [
      "Camas WA movers",
      "Camas moving company",
      "Prune Hill movers",
      "Grass Valley movers",
      "East Vancouver movers",
      "Camas to Portland movers",
    ],
    heroEyebrow: "Camas, WA",
    h1Highlight: "Camas, WA",
    h1Suffix: "Movers — Prune Hill to Downtown, Priced Honestly",
    heroSubtitle:
      "Local Camas crew handling Prune Hill hillside homes, Grass Valley suburban moves, and downtown Camas apartments. Cross-state licensed so moves to Portland or anywhere else in the metro are one simple quote.",
    servicesSubtitle:
      "Full residential and commercial moving service across Camas, Washougal, and the east Clark County corridor.",
    localMovingDescription:
      "Local Camas moves covering Downtown, Prune Hill, Grass Valley, Lacamas, and neighborhoods along the Washougal River Valley. Flat hourly rate, no cross-county mileage fees.",
    longDistanceDescription:
      "Interstate moves out of Camas with full FMCSA licensing. Dedicated truck, same crew loads and unloads, transparent pricing based on distance and inventory.",
    commercialDescription:
      "Commercial moves for Camas-area businesses and medical offices. Evening and weekend scheduling available, no overtime surcharge.",
    whyTitle: "Why Camas Residents Call GOAT",
    whyDescription:
      "Camas has hillside homes in Prune Hill, tight downtown streets, and a tech-professional population that commutes into Portland daily. We're licensed in both WA and OR (most 'Vancouver movers' aren't), so a Camas-to-Portland move is one quote, one crew, no cross-state paperwork delays.",
    whatsIncludedSubtitle:
      "Every Camas move comes with the full package — truck, fuel, tools, protection, crew — for one predictable hourly rate.",
    ctaHeading: "Get Your Exact Camas, WA Moving Price in 30 Seconds",
    ctaTagline: "No hidden fees. Cross-state licensed. Local Camas crew.",
    faqs: [
      { question: "How much do movers cost in Camas, WA?", answer: standardAnswers.pricing },
      {
        question: "Are you licensed for Camas-to-Portland moves across state lines?",
        answer:
          "Yes. Licensed in both Washington and Oregon with USDOT #4232069. Cross-river Camas ↔ Portland moves are one of our regular routes — no bridge toll surcharges.",
      },
      {
        question: "Can you handle Prune Hill hillside driveways?",
        answer:
          "Yes. Hillside driveways and multi-level homes are handled within the hourly rate. Where main-truck access is tight, we shuttle with a smaller truck at no extra cost.",
      },
      {
        question: "Do you charge extra to drive out to Camas from Portland?",
        answer:
          "No. Camas is a regular part of our service area at the same hourly rate. No east-county mileage surcharge.",
      },
      {
        question: "Are you licensed and insured in Washington?",
        answer: standardAnswers.insurance,
      },
      {
        question: "How far in advance should I book?",
        answer: standardAnswers.booking,
      },
    ],
  },

  /* ============================== GRESHAM, OR ============================== */
  {
    slug: "gresham-movers",
    city: "Gresham",
    cityDisplay: "Gresham, OR",
    state: "OR",
    stateLong: "Oregon",
    heroImage: "/images/location-gresham.jpg",
    heroImagePosition: "object-[25%_center]",
    metaTitle: "Gresham OR Movers — Rockwood, Pleasant Valley & Downtown",
    metaDescription:
      "Gresham movers for Rockwood apartments, Pleasant Valley homes, and Downtown condos. Same pricing as Portland — no east-metro surcharge. Licensed, insured, $125/hr.",
    keywords: [
      "Gresham OR movers",
      "Gresham moving company",
      "Rockwood movers",
      "Pleasant Valley movers",
      "east Portland movers",
      "Gresham to Portland movers",
    ],
    heroEyebrow: "Gresham, OR",
    h1Highlight: "Gresham",
    h1Suffix: "Movers — East Portland Metro, Priced Like Portland",
    heroSubtitle:
      "Local Gresham crew for Rockwood apartments, Pleasant Valley family homes, and Downtown Gresham condos. Same hourly rate as Portland — no east-metro driving surcharge.",
    servicesSubtitle:
      "Full-service moving across Gresham, Fairview, Troutdale, and east Multnomah County — licensed, insured, predictable.",
    localMovingDescription:
      "Local Gresham moves across Rockwood, Pleasant Valley, Downtown Gresham, Powell Valley, Centennial, and Wilkes East. Flat hourly pricing with truck, fuel, and full crew included.",
    longDistanceDescription:
      "Interstate moves from Gresham with federal authority (USDOT #4232069). Door-to-door delivery, same crew both ends, no warehouse stops.",
    commercialDescription:
      "Commercial and office relocations for Gresham professional services. Evening and weekend scheduling keeps business-hours disruption at zero.",
    whyTitle: "Why Gresham Residents Skip the National Chains",
    whyDescription:
      "Gresham is east enough that most 'Portland metro' movers add a mileage surcharge or just quote higher hourly. We don't. Our trucks are staged to cover east Multnomah County same-day, we know Rockwood's apartment rules, and we show up with the same transparent hourly rate we charge for a Portland move.",
    whatsIncludedSubtitle:
      "Every Gresham move comes with the full service package — truck, crew, pads, dollies, straps, fuel — for one hourly rate.",
    ctaHeading: "Get Your Exact Gresham Moving Price in 30 Seconds",
    ctaTagline: "Same price as Portland. No east-metro surcharge. Licensed, insured.",
    faqs: [
      { question: "How much do movers cost in Gresham, OR?", answer: standardAnswers.pricing },
      {
        question: "Do you charge Portland prices in Gresham?",
        answer:
          "No — Gresham gets the same transparent hourly rate as every other city we cover. No east-metro mileage surcharge, no 'extra drive' fee.",
      },
      {
        question: "Do you handle moves between Gresham and Portland?",
        answer:
          "Yes. Gresham ↔ Portland is a common route. Same hourly rate, one crew, no hand-offs between movers.",
      },
      {
        question: "Can you handle Rockwood apartment complexes?",
        answer:
          "Yes. We coordinate elevator reservations, submit COI to building management, and plan truck staging around Rockwood's narrow parking areas.",
      },
      {
        question: "Are you licensed and insured in Oregon?",
        answer: standardAnswers.insurance,
      },
      {
        question: "How far in advance should I book?",
        answer: standardAnswers.booking,
      },
    ],
  },

  /* ============================== OREGON CITY, OR ============================== */
  {
    slug: "oregon-city-movers",
    city: "Oregon City",
    cityDisplay: "Oregon City, OR",
    state: "OR",
    stateLong: "Oregon",
    heroImage: "/images/location-oregon-city.jpg",
    heroImagePosition: "object-[25%_center]",
    metaTitle: "Oregon City OR Movers — Hillside Homes & Historic Downtown",
    metaDescription:
      "Oregon City, OR movers specializing in hillside properties, narrow bluff driveways, and historic Canemah homes. $125/hr, no hidden fees. Licensed, insured.",
    keywords: [
      "Oregon City OR movers",
      "Oregon City moving company",
      "Canemah movers",
      "Park Place movers",
      "Clackamas County movers",
      "bluff homes movers",
    ],
    heroEyebrow: "Oregon City, OR",
    h1Highlight: "Oregon City",
    h1Suffix: "Movers — Hillside Homes, Bluff Driveways, Historic Downtowns",
    heroSubtitle:
      "Local Oregon City crew equipped for steep driveways, narrow Canemah streets, and 1900s-era historic homes with staircases no national chain crew wants to deal with. $125 flat per hour.",
    servicesSubtitle:
      "Full-service moving across Oregon City, Park Place, Canemah, and south Clackamas County.",
    localMovingDescription:
      "Local Oregon City moves through McLoughlin, Hilltop, Canemah, South End, Park Place, and Caufield. Flat hourly pricing including navigation of the bluffs and old-town staircases.",
    longDistanceDescription:
      "Long-distance moves from Oregon City with FMCSA interstate authority. One crew, one truck, one price.",
    commercialDescription:
      "Commercial moves for Oregon City's downtown retail, medical, and professional offices. Weekend scheduling available for zero weekday downtime.",
    whyTitle: "Why Oregon City Homeowners Call GOAT",
    whyDescription:
      "Oregon City homes come with real challenges: bluff driveways too steep for a 26-foot truck, Canemah streets that don't fit modern vehicles, 1880s houses with spiral staircases. We come prepared — smaller shuttle trucks, extra dollies, crews trained for antiques and narrow-entry moves — at the same flat hourly rate as a flat-lot Portland move.",
    whatsIncludedSubtitle:
      "Every Oregon City move includes truck, fuel, tools, protection, and a crew that's moved every kind of home in the area — flat-lot new build to bluff-top 1920s.",
    ctaHeading: "Get Your Exact Oregon City Moving Price in 30 Seconds",
    ctaTagline: "No bluff-driveway surcharge. No hidden fees. Licensed, insured.",
    faqs: [
      { question: "How much do movers cost in Oregon City, OR?", answer: standardAnswers.pricing },
      {
        question: "Can you handle steep bluff driveways and narrow Canemah streets?",
        answer:
          "Yes. We arrive with a shuttle plan when the 26-footer can't make the driveway — smaller truck, extra dollies, more crew hours to compensate for the longer carry. No extra surcharges.",
      },
      {
        question: "Do you handle historic downtown Oregon City homes?",
        answer:
          "Yes. Pre-1920 homes with narrow stairs, spiral staircases, and tight entryways are a regular job for us. Crews are trained to navigate tight angles and protect original finishes.",
      },
      {
        question: "Do you charge extra to drive out to Oregon City from Portland?",
        answer:
          "No. Oregon City is part of our standard service area — same hourly rate as Portland.",
      },
      {
        question: "Are you licensed and insured in Oregon?",
        answer: standardAnswers.insurance,
      },
      {
        question: "How far in advance should I book?",
        answer: standardAnswers.booking,
      },
    ],
  },

  /* ============================== SEATTLE, WA ============================== */
  {
    slug: "seattle-movers",
    city: "Seattle",
    cityDisplay: "Seattle, WA",
    state: "WA",
    stateLong: "Washington",
    heroImage: "/images/location-seattle.jpg",
    heroImagePosition: "object-[25%_center]",
    metaTitle: "Seattle WA Movers — Capitol Hill, Queen Anne & SLU High-Rises",
    metaDescription:
      "Seattle movers who handle steep hills, high-rise elevators, and SLU loading docks. $125/hr flat, COI on request, licensed and insured. 500+ Seattle-area moves.",
    keywords: [
      "Seattle WA movers",
      "Seattle moving company",
      "Capitol Hill movers",
      "Queen Anne movers",
      "South Lake Union movers",
      "Ballard movers",
      "Belltown movers",
    ],
    heroEyebrow: "Seattle, WA",
    h1Highlight: "Seattle",
    h1Suffix: "Movers — Hills, High-Rises and Rainy Days, Handled",
    heroSubtitle:
      "Local Seattle crew running high-rise moves in South Lake Union, walk-ups in Capitol Hill, and hillside homes in Queen Anne and Magnolia. $125 flat per hour, COI delivered 48 hours early.",
    servicesSubtitle:
      "Full moving service across Seattle and the greater Puget Sound region — licensed, insured, experienced with Seattle-specific logistics.",
    localMovingDescription:
      "Local Seattle moves across Capitol Hill, Queen Anne, South Lake Union, Ballard, Fremont, Belltown, West Seattle, and Magnolia. Hourly pricing with everything — truck, fuel, equipment, crew — included.",
    longDistanceDescription:
      "Long-distance moves out of Seattle with federal authority (USDOT #4232069). Cross-state and cross-country routes with same-crew delivery.",
    commercialDescription:
      "Commercial relocations for Seattle tech, professional services, and downtown offices. After-hours and weekend scheduling to keep your business running.",
    whyTitle: "Why Seattle Residents Call GOAT for the Hard Moves",
    whyDescription:
      "Seattle moves are hard: Queen Anne's hill is legitimately steep, SLU towers have 90-minute service-elevator windows, Capitol Hill walk-ups mean hauling a couch up three flights in the rain. We've done all of it. We bring extra crew for elevator pressure, stage trucks so traffic cops don't ticket us, and show up with the actual tools for Seattle geography — dollies, stair rollers, weather protection.",
    whatsIncludedSubtitle:
      "Every Seattle move comes with truck, fuel, crew, pads, dollies, plastic wrap for rainy-day moves, and basic disassembly — all for one hourly rate.",
    ctaHeading: "Get Your Exact Seattle Moving Price in 30 Seconds",
    ctaTagline: "No hill surcharge. No high-rise fee. Licensed, insured, COI on request.",
    faqs: [
      { question: "How much do movers cost in Seattle, WA?", answer: standardAnswers.pricing },
      {
        question: "Can you handle high-rise and apartment moves in South Lake Union or Belltown?",
        answer:
          "Yes. We manage elevator reservations, loading dock scheduling, and submit COI to building management ahead of the move. Buildings we've worked before — many SLU and Belltown towers — we already know their rules.",
      },
      {
        question: "Do you handle Seattle's steep hills in Queen Anne, Magnolia, and Capitol Hill?",
        answer:
          "Yes. Hillside moves are a daily part of our Seattle work — we bring extra crew, use shuttle trucks where needed, and price the move hourly so the extra labor is already included.",
      },
      {
        question: "Do you charge extra for rainy-day moves?",
        answer:
          "No. Plastic wrap for furniture and moving blankets for electronics are included in the base rate. Seattle rain is the job — no weather surcharge.",
      },
      {
        question: "Are you licensed and insured in Washington?",
        answer: standardAnswers.insurance,
      },
      {
        question: "How far in advance should I book a Seattle move?",
        answer: standardAnswers.booking,
      },
    ],
  },
];
