"use client";

/**
 * Format a raw string of digits as a US phone number: "+1 (XXX) XXX-XXXX".
 * Strips everything non-digit first, then builds up the display string
 * incrementally as the user types.
 */
export function formatUsPhone(raw: string): string {
  // Strip leading "+1" / "1" country code before counting digits.
  const digits = raw.replace(/\D/g, "").replace(/^1/, "").slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `+1 (${digits}`;
  if (digits.length <= 6) return `+1 (${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

/** RFC 5322-lite email regex, good enough for client-side UX validation. */
const EMAIL_PATTERN = "[^@\\s]+@[^@\\s]+\\.[^@\\s]+";

export function FormInput({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  required,
  name,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value?: string;
  onChange?: (v: string) => void;
  required?: boolean;
  name?: string;
}) {
  const isPhone = type === "tel";
  const isEmail = type === "email";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;
    onChange(isPhone ? formatUsPhone(e.target.value) : e.target.value);
  };

  return (
    <div className="flex-1 min-w-0 flex flex-col gap-2">
      <label className="font-mono font-bold text-base leading-[1.2] tracking-[-0.64px] uppercase text-white/40">
        {label}
        {required && <span className="text-[#FFE533]"> *</span>}
      </label>
      <input
        type={type}
        name={name}
        inputMode={isPhone ? "tel" : isEmail ? "email" : undefined}
        autoComplete={isPhone ? "tel" : isEmail ? "email" : undefined}
        placeholder={placeholder}
        value={value}
        required={required}
        pattern={isEmail ? EMAIL_PATTERN : undefined}
        onChange={handleChange}
        className="backdrop-blur-[20px] bg-white/10 rounded-[10px] h-[56px] lg:h-[57px] px-4 font-sans font-normal text-base lg:text-lg leading-[1.5] lg:leading-[1.4] tracking-[-0.48px] lg:tracking-[-0.36px] text-white placeholder:text-white/60 outline-none focus:bg-white/15 input-glow transition-all duration-200 invalid:[&:not(:placeholder-shown)]:ring-1 invalid:[&:not(:placeholder-shown)]:ring-[#FF6B6B]"
      />
    </div>
  );
}
