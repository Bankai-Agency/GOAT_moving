"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LPInput, formatUsPhone, type LPSurface } from "./LPInput";
import { LPButton } from "./LPButton";
import { DatePicker } from "./DatePicker";
import { SelectDropdown } from "./SelectDropdown";
import { MOVE_SIZES } from "./QuoteForm";
import type { QuoteFormValues } from "./QuoteForm";

/* ════════════════════════════════════════════════════════════════
   StepQuoteForm — 2-step quote form (contact → move details).
   Uses canonical LP primitives (LPInput / LPButton). The `surface`
   prop ("light" | "glass") is forwarded to every LPInput so the
   form auto-adapts to whichever parent card it's rendered in.
   ════════════════════════════════════════════════════════════════ */

const TOTAL_STEPS = 2;

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

const isValidPhone = (v: string) => v.replace(/\D/g, "").length >= 10;
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/* ─────── Step indicator ─────── */
function StepIndicator({ current, surface }: { current: number; surface: LPSurface }) {
  return (
    <div className="flex items-center gap-4">
      <span className={`lp-step-counter lp-step-counter--${surface}`}>
        Step {current} of {TOTAL_STEPS}
      </span>
      <div className="flex gap-2">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => {
          const state =
            i + 1 === current ? "active" : i + 1 < current ? "done" : "future";
          return (
            <div
              key={i}
              className={`lp-step-pill lp-step-pill--${state} lp-step-pill--${surface}`}
            />
          );
        })}
      </div>
    </div>
  );
}

export type StepQuoteFormProps = {
  heading?: string;
  city?: string;
  surface?: LPSurface;
};

export function StepQuoteForm({
  heading = "Get your free quote",
  city: _city,
  surface = "light",
}: StepQuoteFormProps) {
  const router = useRouter();
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
    if (!isValidPhone(values.phone))
      errs.phone = "Enter a valid 10-digit phone number";
    if (values.email && !isValidEmail(values.email))
      errs.email = "Enter a valid email";
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
    setValues(empty);
    setErrors({});
    setStep(1);
    setSubmitting(false);
    router.push("/thank-you");
  };

  return (
    <div className="flex flex-col gap-6">
      <StepIndicator current={step} surface={surface} />

      <h3 className={`lp-form-heading lp-form-heading--${surface}`}>
        {step === 1 ? heading : "Move details"}
      </h3>

      {step === 1 && (
        <div className="flex flex-col gap-5">
          <LPInput
            label="Full name"
            placeholder="Enter your name"
            required
            value={values.fullName}
            onChange={(v) => set("fullName", v)}
            surface={surface}
            error={errors.fullName}
          />
          <LPInput
            label="Phone number"
            type="tel"
            placeholder="(555) 123-4567"
            required
            value={values.phone}
            onChange={(v) => set("phone", v)}
            surface={surface}
            error={errors.phone}
            format={formatUsPhone}
          />
          <LPInput
            label="Email"
            type="email"
            placeholder="your@email.com"
            value={values.email}
            onChange={(v) => set("email", v)}
            surface={surface}
            error={errors.email}
          />
          <LPButton
            type="button"
            onClick={() => {
              if (validateStep1()) setStep(2);
            }}
            fullWidth
          >
            Continue to Move details
          </LPButton>
          <p className={`lp-form-helper lp-form-helper--${surface}`}>
            Enter your name and phone so we can send you a quote.
          </p>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-5">
          <LPInput
            label="Moving from"
            placeholder="Address"
            value={values.movingFrom}
            onChange={(v) => set("movingFrom", v)}
            surface={surface}
          />
          <LPInput
            label="Moving to"
            placeholder="Address"
            value={values.movingTo}
            onChange={(v) => set("movingTo", v)}
            surface={surface}
          />
          <DatePicker
            label="Move date"
            placeholder="Choose date"
            value={values.moveDate}
            onChange={(v) => set("moveDate", v)}
          />
          <SelectDropdown
            label="Move size"
            placeholder="Select size"
            options={MOVE_SIZES}
            value={values.moveSize}
            onChange={(v) => set("moveSize", v)}
          />
          <LPButton
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            fullWidth
          >
            {submitting ? "Sending…" : "Submit Request"}
          </LPButton>
          <LPButton
            variant="ghost"
            size="sm"
            onClick={() => setStep(1)}
            className="self-center"
          >
            ← Back
          </LPButton>
        </div>
      )}
    </div>
  );
}
