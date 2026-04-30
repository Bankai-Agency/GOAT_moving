"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DatePicker } from "@/components/ui/DatePicker";
import { formatUsPhone } from "@/components/ui/FormInput";

const EMAIL_PATTERN = "[^@\\s]+@[^@\\s]+\\.[^@\\s]+";

function ModalInput({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  required = false,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
}) {
  const isPhone = type === "tel";
  const isEmail = type === "email";
  return (
    <div className="flex-1 flex flex-col gap-2">
      <label className="font-mono font-bold text-base leading-[1.2] tracking-[-0.64px] uppercase text-white/40">
        {label}
        {required && <span className="text-[#FFE533]"> *</span>}
      </label>
      <input
        type={type}
        inputMode={isPhone ? "tel" : isEmail ? "email" : undefined}
        autoComplete={isPhone ? "tel" : isEmail ? "email" : undefined}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(isPhone ? formatUsPhone(e.target.value) : e.target.value)}
        required={required}
        pattern={isEmail ? EMAIL_PATTERN : undefined}
        className="backdrop-blur-[20px] bg-white/10 rounded-[10px] h-[56px] px-4 font-sans font-normal text-base lg:text-lg leading-[1.5] lg:leading-[1.4] tracking-[-0.48px] lg:tracking-[-0.36px] text-white placeholder:text-white/60 outline-none focus:bg-white/15 input-glow transition-all duration-200 invalid:[&:not(:placeholder-shown)]:ring-1 invalid:[&:not(:placeholder-shown)]:ring-[#FF6B6B]"
      />
    </div>
  );
}

type ModalFormData = {
  fullName: string;
  email: string;
  phone: string;
  movingFrom: string;
  movingTo: string;
  moveDate: string;
  message: string;
};

const emptyForm: ModalFormData = {
  fullName: "",
  email: "",
  phone: "",
  movingFrom: "",
  movingTo: "",
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
    router.push("/thank-you");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose} />

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
                    label="Email"
                    placeholder="your@email.com"
                    type="email"
                    value={formData.email}
                    onChange={(val) => setFormData({ ...formData, email: val })}
                  />
                  {errors.email && <span className="text-sm text-red-400">{errors.email}</span>}
                </div>

                <button
                  type="button"
                  onClick={handleContinue}
                  className="btn-shine bg-[#FFE533] rounded-lg h-[52px] flex items-center justify-center cursor-pointer hover:bg-[#f0d820] hover:shadow-[0_4px_20px_rgba(255,229,51,0.35)] hover:scale-[1.02] transition-all duration-300 ease-out mt-2"
                >
                  <span className="font-mono font-bold text-base leading-[1.2] tracking-[-0.64px] uppercase text-[#0c0c0c]">
                    Continue
                  </span>
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="flex flex-col lg:flex-row gap-5">
                  <ModalInput
                    label="Moving from"
                    placeholder="Address"
                    value={formData.movingFrom}
                    onChange={(val) => setFormData({ ...formData, movingFrom: val })}
                    required
                  />
                  <ModalInput
                    label="Moving to"
                    placeholder="Address"
                    value={formData.movingTo}
                    onChange={(val) => setFormData({ ...formData, movingTo: val })}
                    required
                  />
                </div>
                <DatePicker
                  label="Move date"
                  placeholder="Choose date"
                  value={formData.moveDate}
                  onChange={(val) => setFormData({ ...formData, moveDate: val })}
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
                    className="backdrop-blur-[20px] bg-white/10 rounded-[10px] p-4 h-[120px] font-sans font-normal text-base lg:text-lg leading-[1.5] lg:leading-[1.4] tracking-[-0.48px] lg:tracking-[-0.36px] text-white placeholder:text-white/60 outline-none focus:bg-white/15 input-glow transition-all duration-200 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-shine bg-[#FFE533] rounded-lg h-[52px] flex items-center justify-center cursor-pointer hover:bg-[#f0d820] hover:shadow-[0_4px_20px_rgba(255,229,51,0.35)] hover:scale-[1.02] transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  <span className="font-mono font-bold text-base leading-[1.2] tracking-[-0.64px] uppercase text-[#0c0c0c]">
                    {submitting ? "Sending..." : "Submit Request"}
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
          </form>
        </div>
      </div>
    </div>
  );
}
