"use client";

import { useState } from "react";
import { FormInput } from "@/components/ui/FormInput";

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

      <button
        type="submit"
        className="btn-shine bg-white lg:bg-[#FFE533] rounded-lg h-[52px] flex items-center justify-center cursor-pointer hover:bg-[#f0d820] hover:shadow-[0_4px_20px_rgba(255,229,51,0.35)] hover:scale-[1.02] transition-all duration-300 ease-out"
      >
        <span className="font-mono font-bold text-base leading-[1.2] tracking-[-0.64px] uppercase text-[#0c0c0c]">
          {submitLabel}
        </span>
      </button>

      {footnote && (
        <p className="font-sans text-sm text-white/50 text-center">{footnote}</p>
      )}
    </form>
  );
}
