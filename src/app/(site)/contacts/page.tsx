import type { Metadata } from "next";
import ContactsClient from "./ContactsClient";

export const metadata: Metadata = {
  title: "Contact GOAT Movers — Call (380) 524-0846",
  description:
    "Reach GOAT Movers by phone at (380) 524-0846 or request a free moving quote online. Licensed, insured movers serving Vancouver, WA, Portland, OR, and the I-5 corridor.",
  keywords: [
    "contact GOAT Movers",
    "moving company phone",
    "free moving quote",
    "movers Vancouver WA contact",
    "movers Portland OR contact",
  ],
  alternates: { canonical: "/contacts" },
  openGraph: {
    title: "Contact GOAT Movers | Vancouver, WA & Portland, OR",
    description:
      "Call (380) 524-0846 or request a free moving quote online. We serve Vancouver, WA, Portland, OR, and the I-5 corridor.",
    url: "/contacts",
    type: "website",
  },
};

export default function ContactsPage() {
  return <ContactsClient />;
}
