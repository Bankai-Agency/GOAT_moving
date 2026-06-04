"use client";

import { useState } from "react";
import { FormInput } from "@site/ui/FormInput";
import { MP5Button } from "@site/ui/MP5Button";

export type LeadFormProps = {
  /** Heading rendered above the form (omit to hide). */
  heading?: string;
  /** Submit button label. */
  submitLabel?: string;
  /** Footnote rendered under the submit button. */
  footnote?: string;
};

/**
 * Compact two-field lead capture form — captures name + phone, then dispatches
 * the `open-quote-modal` event so the user can finish the rest in the modal.
 * Phase 1 of a two-phase quote flow. Phase 2 lives in QuoteModal.
 */
export function LeadForm({
  heading,
  submitLabel = "Free Quote",
  footnote,
}: LeadFormProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.dispatchEvent(
      new CustomEvent("open-quote-modal", { detail: { fullName, phone } })
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {heading && (
        <h3 className="font-sans font-semibold text-2xl lg:text-[28px] leading-[1.2] tracking-[-0.72px] lg:tracking-[-0.84px] text-white">
          {heading}
        </h3>
      )}

      <FormInput
        label="Full name"
        placeholder="Enter your name"
        required
        value={fullName}
        onChange={setFullName}
      />
      <FormInput
        label="Phone number"
        placeholder="+1 (555) 123-4567"
        type="tel"
        required
        value={phone}
        onChange={setPhone}
      />

      <MP5Button type="submit" fullWidth>
        {submitLabel}
      </MP5Button>

      {footnote && (
        <p className="font-sans text-sm text-white/50 text-center">{footnote}</p>
      )}
    </form>
  );
}
