import type { Metadata } from "next";
import { contactsPageContent } from "@/lib/content";
import { pageMetadata } from "@/lib/content/metadata";
import ContactsClient from "./ContactsClient";

/* Title / description / keywords are edited in the admin panel. */
export const metadata: Metadata = pageMetadata(contactsPageContent.meta, "/contacts");

export default function ContactsPage() {
  return <ContactsClient />;
}
