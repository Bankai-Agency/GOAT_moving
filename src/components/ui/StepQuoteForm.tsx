"use client";

import { useState } from "react";
import { FormInput } from "@/components/ui/FormInput";
import { DatePicker } from "@/components/ui/DatePicker";
import { SelectDropdown } from "@/components/ui/SelectDropdown";
import { SuccessState } from "@/components/ui/SuccessState";
import { MOVE_SIZES } from "@/components/ui/QuoteForm";
import type { QuoteFormValues } from "@/components/ui/QuoteForm";

const TOTAL_STEPS = 3;

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

/* ── Validation helpers ── */
const isValidPhone = (v: string) => v.replace(/\D/g, "").length >= 10;
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/* ── Progress indicator ── */
function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-4">
      <span className="font-mono font-bold text-sm uppercase tracking-[-0.48px] text-[#FFE533]">
        Step {current} of {TOTAL_STEPS}
      </span>
      <div className="flex gap-2">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i + 1 === current
                ? "w-8 bg-[#FFE533]"
                : i + 1 < current
                ? "w-2 bg-[#FFE533]/60"
                : "w-2 bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Shared button styles ── */
function ContinueButton({ label, onClick, disabled }: { label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="btn-shine bg-[#FFE533] rounded-lg h-[52px] lg:h-[56px] flex items-center justify-center cursor-pointer hover:bg-[#f0d820] hover:shadow-[0_4px_20px_rgba(255,229,51,0.35)] hover:scale-[1.02] transition-all duration-300 ease-out w-full shrink-0 lg:w-auto lg:px-8 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span className="font-mono font-bold text-base leading-[1.2] tracking-[-0.64px] uppercase text-[#0c0c0c]">
        {label}
      </span>
    </button>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="font-mono font-bold text-sm uppercase tracking-[-0.48px] text-white/40 hover:text-white/70 transition-colors cursor-pointer self-center"
    >
      &larr; Back
    </button>
  );
}

function ErrorMsg({ text }: { text: string }) {
  return <p className="font-sans text-sm text-red-400">{text}</p>;
}

/* ── Main component ── */
export type StepQuoteFormProps = {
  heading?: string;
  city?: string;
  /** Render fields in a horizontal row (desktop hero bar). */
  horizontal?: boolean;
};

export function StepQuoteForm({
  heading = "Get your free quote",
  city,
  horizontal = false,
}: StepQuoteFormProps) {
  const [values, setValues] = useState<QuoteFormValues>(empty);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof QuoteFormValues>(key: K, v: QuoteFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: v }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!values.fullName.trim()) errs.fullName = "Name is required";
    if (!isValidPhone(values.phone)) errs.phone = "Enter a valid 10-digit phone number";
    if (values.email && !isValidEmail(values.email)) errs.email = "Enter a valid email";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
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
    setSubmitting(false);
    setStep(4);
  };

  /* ── Step 4: Success ── */
  if (step === 4) {
    return (
      <SuccessState
        heading="Request Submitted!"
        body="Our team will review your request and get back to you with a personalized quote within 24 hours."
        buttonLabel="Send Another Request"
        onButtonClick={() => {
          setValues(empty);
          setErrors({});
          setStep(1);
        }}
      />
    );
  }

  /* ── Horizontal layout (desktop hero bar) ── */
  if (horizontal) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-sans font-semibold text-lg leading-[1.2] tracking-[-0.54px] text-white whitespace-nowrap">
            {step === 1 && heading}
            {step === 2 && "Move details"}
            {step === 3 && "Almost done"}
          </h3>
          <StepIndicator current={step} />
        </div>

        {step === 1 && (
          <div className="flex items-start gap-3">
            <div className="flex-1 flex flex-col gap-1">
              <FormInput label="Full name" placeholder="Enter your name" required value={values.fullName} onChange={(v) => set("fullName", v)} />
              {errors.fullName && <ErrorMsg text={errors.fullName} />}
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <FormInput label="Phone number" placeholder="+1 (555) 123-4567" type="tel" required value={values.phone} onChange={(v) => set("phone", v)} />
              {errors.phone && <ErrorMsg text={errors.phone} />}
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <FormInput label="Email" placeholder="your@email.com" type="email" value={values.email} onChange={(v) => set("email", v)} />
              {errors.email && <ErrorMsg text={errors.email} />}
            </div>
            <div className="pt-[26px]"><ContinueButton label="Get Your Free Quote" onClick={() => { if (validateStep1()) setStep(2); }} /></div>
          </div>
        )}

        {step === 2 && (
          <div className="flex items-end gap-3">
            <div className="flex-1"><FormInput label="Moving from" placeholder="Address" value={values.movingFrom} onChange={(v) => set("movingFrom", v)} /></div>
            <div className="flex-1"><FormInput label="Moving to" placeholder="Address" value={values.movingTo} onChange={(v) => set("movingTo", v)} /></div>
            <div className="flex-1"><DatePicker label="Move date" placeholder="Choose date" value={values.moveDate} onChange={(v) => set("moveDate", v)} /></div>
            <div className="flex-1"><SelectDropdown label="Move size" placeholder="Select size" options={MOVE_SIZES} value={values.moveSize} onChange={(v) => set("moveSize", v)} /></div>
            <ContinueButton label="Get Your Free Quote" onClick={() => setStep(3)} />
          </div>
        )}
        {step === 2 && <BackButton onClick={() => setStep(1)} />}

        {step === 3 && (
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <textarea
                placeholder="Any special requests or details... (optional)"
                value={values.message}
                onChange={(e) => set("message", e.target.value)}
                className="w-full backdrop-blur-[20px] bg-white/10 rounded-[10px] p-4 h-[56px] font-sans font-normal text-base leading-[1.4] tracking-[-0.48px] text-white placeholder:text-white/60 outline-none focus:bg-white/15 input-glow transition-all duration-200 resize-none"
              />
            </div>
            <ContinueButton label={submitting ? "Sending..." : "Submit Request"} onClick={handleSubmit} disabled={submitting} />
          </div>
        )}
        {step === 3 && <BackButton onClick={() => setStep(2)} />}
      </div>
    );
  }

  /* ── Vertical layout (default / mobile modal) ── */
  return (
    <div className="flex flex-col gap-6">
      <StepIndicator current={step} />

      <h3 className="font-sans font-semibold text-2xl lg:text-[28px] leading-[1.2] tracking-[-0.72px] lg:tracking-[-0.84px] text-white">
        {step === 1 && heading}
        {step === 2 && "Move details"}
        {step === 3 && "Almost done"}
      </h3>

      {step === 1 && (
        <div className="flex flex-col gap-5">
          <FormInput label="Full name" placeholder="Enter your name" required value={values.fullName} onChange={(v) => set("fullName", v)} />
          {errors.fullName && <ErrorMsg text={errors.fullName} />}
          <FormInput label="Phone number" placeholder="+1 (555) 123-4567" type="tel" required value={values.phone} onChange={(v) => set("phone", v)} />
          {errors.phone && <ErrorMsg text={errors.phone} />}
          <FormInput label="Email" placeholder="your@email.com" type="email" value={values.email} onChange={(v) => set("email", v)} />
          {errors.email && <ErrorMsg text={errors.email} />}
          <ContinueButton label="Get Your Free Quote" onClick={() => { if (validateStep1()) setStep(2); }} />
          <p className="font-sans text-sm text-white/40 text-center">
            Enter your name and phone so we can send you a quote.
          </p>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-5">
          <FormInput label="Moving from" placeholder="Address" value={values.movingFrom} onChange={(v) => set("movingFrom", v)} />
          <FormInput label="Moving to" placeholder="Address" value={values.movingTo} onChange={(v) => set("movingTo", v)} />
          <div className="flex flex-col lg:flex-row gap-5 lg:gap-2.5">
            <DatePicker label="Move date" placeholder="Choose date" value={values.moveDate} onChange={(v) => set("moveDate", v)} />
            <SelectDropdown label="Move size" placeholder="Select size" options={MOVE_SIZES} value={values.moveSize} onChange={(v) => set("moveSize", v)} />
          </div>
          <ContinueButton label="Get Your Free Quote" onClick={() => setStep(3)} />
          <BackButton onClick={() => setStep(1)} />
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="font-mono font-bold text-base leading-[1.2] tracking-[-0.64px] uppercase text-white/40">
              Additional Information (Optional)
            </label>
            <textarea
              placeholder="Any special requests or details..."
              value={values.message}
              onChange={(e) => set("message", e.target.value)}
              className="backdrop-blur-[20px] bg-white/10 rounded-[10px] p-4 h-[140px] font-sans font-normal text-base lg:text-lg leading-[1.5] lg:leading-[1.4] tracking-[-0.48px] lg:tracking-[-0.36px] text-white placeholder:text-white/60 outline-none focus:bg-white/15 input-glow transition-all duration-200 resize-none"
            />
          </div>
          <ContinueButton label={submitting ? "Sending..." : "Submit Request"} onClick={handleSubmit} disabled={submitting} />
          <BackButton onClick={() => setStep(2)} />
        </div>
      )}
    </div>
  );
}
