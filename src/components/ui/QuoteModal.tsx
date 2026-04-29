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
};

const emptyForm: ModalFormData = {
  fullName: "",
  email: "",
  phone: "",
  movingFrom: "",
  movingTo: "",
  moveDate: "",
};

export function QuoteModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<ModalFormData>(emptyForm);

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
          {/* Heading */}
          <h2 className="font-sans font-semibold text-[28px] leading-[1.2] tracking-[-0.84px] text-white mb-3">
            Move information
          </h2>
          <p className="font-sans font-normal text-lg leading-[1.4] tracking-[-0.54px] text-white/60 mb-6">
            Fill out a few quick details about your move and we&apos;ll send you a personalized estimate &mdash; no hidden fees, no obligations.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Row 1: name + phone */}
              <div className="flex flex-col lg:flex-row gap-5">
                <ModalInput
                  label="Full name"
                  placeholder="Enter your name"
                  value={formData.fullName}
                  onChange={(val) => setFormData({ ...formData, fullName: val })}
                  required
                />
                <ModalInput
                  label="Phone number"
                  placeholder="+1 (555) 123-4567"
                  type="tel"
                  value={formData.phone}
                  onChange={(val) => setFormData({ ...formData, phone: val })}
                  required
                />
              </div>

              {/* Row 2: email + date */}
              <div className="flex flex-col lg:flex-row gap-5">
                <ModalInput
                  label="Email"
                  placeholder="your@email.com"
                  type="email"
                  value={formData.email}
                  onChange={(val) => setFormData({ ...formData, email: val })}
                />
                <DatePicker
                  label="Move date"
                  placeholder="Choose date"
                  value={formData.moveDate}
                  onChange={(val) => setFormData({ ...formData, moveDate: val })}
                />
              </div>

              {/* Row 3: from + to */}
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

              <button
                type="submit"
                disabled={submitting}
                className="btn-shine bg-white lg:bg-[#FFE533] rounded-lg h-[52px] flex items-center justify-center cursor-pointer hover:bg-[#f0d820] hover:shadow-[0_4px_20px_rgba(255,229,51,0.35)] hover:scale-[1.02] transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                <span className="font-mono font-bold text-base leading-[1.2] tracking-[-0.64px] uppercase text-[#0c0c0c]">
                  {submitting ? "Sending..." : "Submit Request"}
                </span>
              </button>
            </form>
        </div>
      </div>
    </div>
  );
}
