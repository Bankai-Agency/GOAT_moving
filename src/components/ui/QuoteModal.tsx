"use client";

import { useState, useEffect } from "react";
import { DatePicker } from "@/components/ui/DatePicker";
import { formatUsPhone } from "@/components/ui/FormInput";
import { SuccessState } from "@/components/ui/SuccessState";

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

export function QuoteModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    movingFrom: "",
    movingTo: "",
  });

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<Partial<typeof formData>>).detail;
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
    setSubmitted(false);
    setFormData({ fullName: "", phone: "", movingFrom: "", movingTo: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative z-10 w-full max-w-[440px] mx-4 bg-[#141414] rounded-2xl border border-white/10 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="flex items-center gap-2 px-6 pt-5 pb-3 text-white/60 hover:text-white transition-colors font-mono font-bold text-sm uppercase tracking-[-0.48px]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          Close
        </button>

        <div className="px-6 pb-8">
          {submitted ? (
            <SuccessState
              heading="Request Submitted Successfully!"
              body="Our team will review your information and get back to you with a personalized quote within 24 hours."
              buttonLabel="Continue"
              onButtonClick={handleClose}
            />
          ) : (
            <>
              {/* Heading */}
              <h2 className="font-sans font-semibold text-[28px] leading-[1.2] tracking-[-0.84px] text-white mb-3">
                Move information
              </h2>
              <p className="font-sans font-normal text-lg leading-[1.4] tracking-[-0.54px] text-white/60 mb-6">
                Fill out a few quick details about your move and we&apos;ll send you a personalized estimate &mdash; no hidden fees, no obligations.
              </p>
            </>
          )}

          {!submitted && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
              <DatePicker label="Move date" placeholder="Choose date" />

              <button
                type="submit"
                className="btn-shine bg-white lg:bg-[#FFE533] rounded-lg h-[52px] flex items-center justify-center cursor-pointer hover:bg-[#f0d820] hover:shadow-[0_4px_20px_rgba(255,229,51,0.35)] hover:scale-[1.02] transition-all duration-300 ease-out"
              >
                <span className="font-mono font-bold text-base leading-[1.2] tracking-[-0.64px] uppercase text-[#0c0c0c]">
                  Submit Request
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
