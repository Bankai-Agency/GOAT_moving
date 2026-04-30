"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DatePicker } from "@/components/ui/DatePicker";
import { SelectDropdown } from "@/components/ui/SelectDropdown";
import { FormInput } from "@/components/ui/FormInput";

export const MOVE_SIZES = [
  "Room or Less",
  "Studio",
  "Small 1 Bedroom Condo/Aprt.",
  "Large 1 Bedroom Condo/Aprt.",
  "Small 2 Bedroom Condo/Aprt.",
  "Large 2 Bedroom Condo/Aprt.",
  "2 Bedroom Condo/Aprt.",
  "3 Bedroom Condo/Aprt.",
  "4 Bedroom Condo/Aprt.",
  "Commercial Move",
];

export type QuoteFormProps = {
  /** Heading rendered above the form (omit to hide). */
  heading?: string;
  /** Submit button label. */
  submitLabel?: string;
  /** Footnote rendered under the submit button. */
  footnote?: string;
  /** Called with the form values when the user submits. */
  onSubmit?: (values: QuoteFormValues) => void;
};

export type QuoteFormValues = {
  fullName: string;
  email: string;
  phone: string;
  movingFrom: string;
  movingTo: string;
  moveDate: string;
  moveSize: string;
  message: string;
};

const empty: QuoteFormValues = {
  fullName: "",
  email: "",
  phone: "",
  movingFrom: "",
  movingTo: "",
  moveDate: "",
  moveSize: "",
  message: "",
};

export function QuoteForm({
  heading,
  submitLabel = "Get Free Quote",
  footnote,
  onSubmit,
}: QuoteFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<QuoteFormValues>(empty);
  const [step, setStep] = useState<1 | 2>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const isValidPhone = (v: string) => v.replace(/\D/g, "").length >= 10;
  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!values.fullName.trim()) errs.fullName = "Name is required";
    if (!isValidPhone(values.phone)) errs.phone = "Enter a valid 10-digit phone number";
    if (values.email && !isValidEmail(values.email)) errs.email = "Enter a valid email";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContinue = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(values);
    setSubmitting(true);
    try {
      await fetch("/api/submit-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    } catch (err) {
      console.error("Submit failed:", err);
    }
    /* Reset and navigate to /thank-you so analytics can record the conversion. */
    setValues(empty);
    setStep(1);
    setErrors({});
    setSubmitting(false);
    router.push("/thank-you");
  };

  const set = <K extends keyof QuoteFormValues>(key: K, v: QuoteFormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {heading && (
        <h3 className="font-sans font-semibold text-2xl lg:text-[28px] leading-[1.2] tracking-[-0.72px] lg:tracking-[-0.84px] text-white">
          {heading}
        </h3>
      )}

      {/* Step indicator */}
      <div className="flex gap-1.5">
        <span className={`h-1.5 rounded-full transition-all duration-300 ${step === 1 ? "w-8 bg-[#FFE533]" : "w-2 bg-[#FFE533]/60"}`} />
        <span className={`h-1.5 rounded-full transition-all duration-300 ${step === 2 ? "w-8 bg-[#FFE533]" : "w-2 bg-white/20"}`} />
      </div>

      {step === 1 && (
        <>
          <div className="flex flex-col lg:flex-row gap-5 lg:gap-2.5">
            <div className="flex-1 flex flex-col gap-2">
              <FormInput label="Full name" placeholder="Enter your name" required value={values.fullName} onChange={(v) => set("fullName", v)} />
              {errors.fullName && <span className="text-sm text-red-400">{errors.fullName}</span>}
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <FormInput label="Phone number" placeholder="+1 (555) 123-4567" type="tel" required value={values.phone} onChange={(v) => set("phone", v)} />
              {errors.phone && <span className="text-sm text-red-400">{errors.phone}</span>}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <FormInput label="Email" placeholder="your@email.com" type="email" value={values.email} onChange={(v) => set("email", v)} />
            {errors.email && <span className="text-sm text-red-400">{errors.email}</span>}
          </div>

          <button
            type="button"
            onClick={handleContinue}
            className="btn-shine bg-white lg:bg-[#FFE533] rounded-lg h-[52px] flex items-center justify-center cursor-pointer hover:bg-[#f0d820] hover:shadow-[0_4px_20px_rgba(255,229,51,0.35)] hover:scale-[1.02] transition-all duration-300 ease-out"
          >
            <span className="font-mono font-bold text-base leading-[1.2] tracking-[-0.64px] uppercase text-[#0c0c0c]">
              Continue
            </span>
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <div className="flex flex-col lg:flex-row gap-5 lg:gap-2.5">
            <FormInput label="Moving from" placeholder="Address" value={values.movingFrom} onChange={(v) => set("movingFrom", v)} />
            <FormInput label="Moving to" placeholder="Address" value={values.movingTo} onChange={(v) => set("movingTo", v)} />
          </div>
          <div className="flex flex-col lg:flex-row gap-5 lg:gap-2.5">
            <DatePicker label="Move date" placeholder="Choose date" value={values.moveDate} onChange={(v) => set("moveDate", v)} />
            <SelectDropdown label="Move size" placeholder="Select size" options={MOVE_SIZES} value={values.moveSize} onChange={(v) => set("moveSize", v)} />
          </div>
          <div className="flex flex-col gap-2 h-[160px]">
            <label className="font-mono font-bold text-base leading-[1.2] tracking-[-0.64px] uppercase text-white/40">
              Additional Information (Optional)
            </label>
            <textarea
              placeholder="Any special requests or details..."
              value={values.message}
              onChange={(e) => set("message", e.target.value)}
              className="flex-1 backdrop-blur-[20px] bg-white/10 rounded-[10px] p-4 font-sans font-normal text-base lg:text-lg leading-[1.5] lg:leading-[1.4] tracking-[-0.48px] lg:tracking-[-0.36px] text-white placeholder:text-white/60 outline-none focus:bg-white/15 input-glow transition-all duration-200 resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="btn-shine bg-white lg:bg-[#FFE533] rounded-lg h-[52px] flex items-center justify-center cursor-pointer hover:bg-[#f0d820] hover:shadow-[0_4px_20px_rgba(255,229,51,0.35)] hover:scale-[1.02] transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="font-mono font-bold text-base leading-[1.2] tracking-[-0.64px] uppercase text-[#0c0c0c]">
              {submitting ? "Sending..." : submitLabel}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="font-mono font-bold text-sm uppercase tracking-[-0.48px] text-white/40 hover:text-white/70 transition-colors cursor-pointer self-center"
          >
            Back
          </button>
        </>
      )}

      {footnote && (
        <p className="font-sans text-sm text-white/50 text-center">{footnote}</p>
      )}
    </form>
  );
}
