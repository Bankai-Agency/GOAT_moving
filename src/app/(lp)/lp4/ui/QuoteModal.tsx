"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DatePicker } from "./DatePicker";
import { formatUsPhone } from "./FormInput";
import { LPButton } from "./LPButton";
import { pushLeadEvent } from "./leadEvent";

/** Keep only the 5 ZIP digits as the user types. */
const formatZip = (v: string) => v.replace(/\D/g, "").slice(0, 5);

const EMAIL_PATTERN = "[^@\\s]+@[^@\\s]+\\.[^@\\s]+";

function ModalInput({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  required = false,
  name,
  inputMode,
  format,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  /** Stable field name + id — needed so analytics captures consistent
      params instead of random per-render ids. */
  name?: string;
  inputMode?: "text" | "tel" | "email" | "numeric";
  /** Optional value formatter (phone, ZIP). Overrides the phone default. */
  format?: (val: string) => string;
}) {
  const isPhone = type === "tel";
  const isEmail = type === "email";
  const formatValue = format ?? (isPhone ? formatUsPhone : undefined);
  return (
    <div className="flex-1 flex flex-col gap-2">
      <label
        className="font-mono font-bold text-base leading-[1.2] tracking-[-0.64px] uppercase text-white/40"
        htmlFor={name ? `modal-${name}` : undefined}
      >
        {label}
        {required && <span className="text-[#FFE533]"> *</span>}
      </label>
      <input
        id={name ? `modal-${name}` : undefined}
        name={name}
        type={type}
        inputMode={inputMode ?? (isPhone ? "tel" : isEmail ? "email" : undefined)}
        autoComplete={isPhone ? "tel" : isEmail ? "email" : undefined}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(formatValue ? formatValue(e.target.value) : e.target.value)}
        required={required}
        pattern={isEmail ? EMAIL_PATTERN : undefined}
        className="w-full backdrop-blur-[20px] bg-white/10 rounded-[10px] h-[56px] px-4 font-sans font-normal text-base lg:text-lg leading-[1.5] lg:leading-[1.4] tracking-[-0.48px] lg:tracking-[-0.36px] text-white placeholder:text-white/60 outline-none focus:bg-white/15 transition-all duration-200 invalid:[&:not(:placeholder-shown)]:ring-1 invalid:[&:not(:placeholder-shown)]:ring-[#FF6B6B]"
      />
    </div>
  );
}

type ModalFormData = {
  fullName: string;
  email: string;
  phone: string;
  movingFrom: string;
  fromZip: string;
  movingTo: string;
  toZip: string;
  moveDate: string;
  message: string;
};

const emptyForm: ModalFormData = {
  fullName: "",
  email: "",
  phone: "",
  movingFrom: "",
  fromZip: "",
  movingTo: "",
  toZip: "",
  moveDate: "",
  message: "",
};

/* ── Validation helpers ── */
const isValidPhone = (v: string) => v.replace(/\D/g, "").length >= 10;
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export function QuoteModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<ModalFormData>(emptyForm);
  const [agreesToPrivacy, setAgreesToPrivacy] = useState(true);

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = "Name is required";
    if (!isValidPhone(formData.phone)) errs.phone = "Enter a valid 10-digit phone number";
    if (formData.email && !isValidEmail(formData.email)) errs.email = "Enter a valid email";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<Partial<ModalFormData>>).detail;
      if (detail) {
        setFormData((prev) => ({ ...prev, ...detail }));
      }
      setIsOpen(true);
    };
    window.addEventListener("open-quote-modal", handler);
    return () => window.removeEventListener("open-quote-modal", handler);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    setFormData(emptyForm);
    setStep(1);
    setErrors({});
  };

  const handleContinue = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/submit-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      /* Consistent conversion event for GTM/GA4 — same shape as the
         embedded form so reporting matches across both forms. */
      pushLeadEvent({ formLocation: "modal" });
    } catch (err) {
      console.error("Submit failed:", err);
    }
    /* Close modal + navigate to the dedicated thank-you page so analytics
       (GA4 / Ads conversions) can fire on a real URL change. */
    setIsOpen(false);
    setFormData(emptyForm);
    setStep(1);
    setErrors({});
    setSubmitting(false);
    /* Pass the current LP path so /thank-you's "Back" button can return
       the user to THIS landing (referrer is unreliable after a soft push). */
    router.push(`/thank-you?from=${encodeURIComponent(window.location.pathname)}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose} />

      {/* Dark modal surface matching the corporate site modal: #141414
          card + glass inputs + white text. lp4 no longer uses the
          theme-light flip, so the dark bg renders as-authored. */}
      <div className="relative z-10 w-full max-w-[440px] lg:max-w-[760px] mx-4 bg-[#141414] rounded-2xl border border-white/10 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Close button — top-right corner */}
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/60 hover:text-white hover:scale-110 transition-all duration-200"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="px-6 lg:px-8 pt-8 pb-8">
          {/* Step indicator */}
          <div className="flex gap-1.5 mb-3">
            <span className={`h-1.5 rounded-full transition-all duration-300 ${step === 1 ? "w-8 bg-[#FFE533]" : "w-2 bg-[#FFE533]/60"}`} />
            <span className={`h-1.5 rounded-full transition-all duration-300 ${step === 2 ? "w-8 bg-[#FFE533]" : "w-2 bg-white/20"}`} />
          </div>

          {/* Heading */}
          <h2 className="font-sans font-semibold text-[28px] leading-[1.2] tracking-[-0.84px] text-white mb-3">
            {step === 1 ? "Your contact info" : "Move details"}
          </h2>
          <p className="font-sans font-normal text-lg leading-[1.4] tracking-[-0.54px] text-white/60 mb-6">
            {step === 1
              ? "Tell us how to reach you with a personalized quote — no hidden fees, no obligations."
              : "A few details about the move so we can put together your estimate."}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {step === 1 && (
              <>
                <div className="flex flex-col lg:flex-row gap-5">
                  <div className="flex-1 flex flex-col gap-2">
                    <ModalInput
                      name="fullName"
                      label="Full name"
                      placeholder="Enter your name"
                      value={formData.fullName}
                      onChange={(val) => setFormData({ ...formData, fullName: val })}
                      required
                    />
                    {errors.fullName && <span className="text-sm text-red-400">{errors.fullName}</span>}
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <ModalInput
                      name="phone"
                      label="Phone number"
                      placeholder="+1 (555) 123-4567"
                      type="tel"
                      value={formData.phone}
                      onChange={(val) => setFormData({ ...formData, phone: val })}
                      required
                    />
                    {errors.phone && <span className="text-sm text-red-400">{errors.phone}</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <ModalInput
                    name="email"
                    label="Email"
                    placeholder="your@email.com"
                    type="email"
                    value={formData.email}
                    onChange={(val) => setFormData({ ...formData, email: val })}
                  />
                  {errors.email && <span className="text-sm text-red-400">{errors.email}</span>}
                </div>

                <LPButton type="button" onClick={handleContinue} fullWidth className="mt-2">
                  Continue
                </LPButton>
              </>
            )}

            {step === 2 && (
              <>
                <div className="flex flex-col lg:flex-row gap-5">
                  <ModalInput
                    name="movingFrom"
                    label="Moving from"
                    placeholder="Address"
                    value={formData.movingFrom}
                    onChange={(val) => setFormData({ ...formData, movingFrom: val })}
                    required
                  />
                  <ModalInput
                    name="fromZip"
                    label="From ZIP"
                    placeholder="ZIP code"
                    inputMode="numeric"
                    format={formatZip}
                    value={formData.fromZip}
                    onChange={(val) => setFormData({ ...formData, fromZip: val })}
                  />
                </div>
                <div className="flex flex-col lg:flex-row gap-5">
                  <ModalInput
                    name="movingTo"
                    label="Moving to"
                    placeholder="Address"
                    value={formData.movingTo}
                    onChange={(val) => setFormData({ ...formData, movingTo: val })}
                    required
                  />
                  <ModalInput
                    name="toZip"
                    label="To ZIP"
                    placeholder="ZIP code"
                    inputMode="numeric"
                    format={formatZip}
                    value={formData.toZip}
                    onChange={(val) => setFormData({ ...formData, toZip: val })}
                  />
                </div>
                <DatePicker
                  label="Move date"
                  placeholder="Choose date"
                  value={formData.moveDate}
                  onChange={(val) => setFormData({ ...formData, moveDate: val })}
                  surface="glass"
                />

                {/* Optional message */}
                <div className="flex flex-col gap-2">
                  <label className="font-mono font-bold text-base leading-[1.2] tracking-[-0.64px] uppercase text-white/40">
                    Additional Information (Optional)
                  </label>
                  <textarea
                    placeholder="Any special requests or details..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full backdrop-blur-[20px] bg-white/10 rounded-[10px] p-4 h-[120px] font-sans font-normal text-base lg:text-lg leading-[1.5] lg:leading-[1.4] tracking-[-0.48px] lg:tracking-[-0.36px] text-white placeholder:text-white/60 outline-none focus:bg-white/15 transition-all duration-200 resize-none"
                  />
                </div>

                {/* Privacy consent — checked by default. Submit stays
                    disabled unless this is checked. */}
                <label className="flex items-start gap-2.5 cursor-pointer select-none mt-1">
                  <input
                    type="checkbox"
                    checked={agreesToPrivacy}
                    onChange={(e) => setAgreesToPrivacy(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded cursor-pointer shrink-0 accent-[#FFE533]"
                  />
                  <span className="font-sans font-normal text-[13px] leading-[1.4] tracking-[-0.2px] text-white/70">
                    By submitting, you agree to our{" "}
                    <Link
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white underline underline-offset-2 hover:opacity-80"
                    >
                      Privacy Policy
                    </Link>{" "}
                    and consent to be contacted about your move.
                  </span>
                </label>
                <LPButton type="submit" disabled={submitting || !agreesToPrivacy} fullWidth className="mt-2">
                  {submitting ? "Sending..." : "Submit Request"}
                </LPButton>
                <LPButton variant="ghost" size="sm" onClick={() => setStep(1)} className="self-center">
                  ← Back
                </LPButton>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
