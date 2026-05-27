"use client";

import type { CSSProperties } from "react";

/* ════════════════════════════════════════════════════════════════
   LPInput / LPLabel / LPTextarea — canonical form primitives.

   Single source of truth for the LP form palette. If something
   looks wrong, fix THIS file or the .lp-input/.lp-label CSS
   classes — do NOT add scoped overrides elsewhere.

   Surface:
     • Default (white card) — light grey fill + ink text
     • Glass mode (`surface="glass"`) — translucent dark fill +
       white text. Used on the hero glass form bar.
   ════════════════════════════════════════════════════════════════ */

export type LPSurface = "light" | "glass";

/* ─────── Label ─────── */

type LabelProps = {
  htmlFor?: string;
  required?: boolean;
  surface?: LPSurface;
  children: React.ReactNode;
};

export function LPLabel({ htmlFor, required, surface = "light", children }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className={`lp-label lp-label--${surface}`}>
      {children}
      {required && <span className="lp-label__required"> *</span>}
    </label>
  );
}

/* ─────── Input ─────── */

type InputProps = {
  id?: string;
  name?: string;
  type?: "text" | "email" | "tel" | "url";
  inputMode?: "text" | "email" | "tel" | "url" | "numeric" | "search";
  label?: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  surface?: LPSurface;
  error?: string;
  /** Format helper — runs on each onChange. e.g. formatUsPhone. */
  format?: (v: string) => string;
  className?: string;
  style?: CSSProperties;
};

export function LPInput({
  id,
  name,
  type = "text",
  inputMode,
  label,
  placeholder,
  required,
  value,
  onChange,
  surface = "light",
  error,
  format,
  className = "",
  style,
}: InputProps) {
  const inputId = id ?? `lp-input-${name ?? Math.random().toString(36).slice(2, 8)}`;
  return (
    <div className={`flex flex-col gap-2 flex-1 min-w-0 ${className}`} style={style}>
      {label && (
        <LPLabel htmlFor={inputId} required={required} surface={surface}>
          {label}
        </LPLabel>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        inputMode={
          inputMode ??
          (type === "tel" ? "tel" : type === "email" ? "email" : undefined)
        }
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={(e) =>
          onChange(format ? format(e.target.value) : e.target.value)
        }
        className={`lp-input lp-input--${surface}`}
      />
      {error && <span className="lp-input__error">{error}</span>}
    </div>
  );
}

/* ─────── Textarea ─────── */

type TextareaProps = {
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  surface?: LPSurface;
  rows?: number;
  className?: string;
};

export function LPTextarea({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  surface = "light",
  rows = 4,
  className = "",
}: TextareaProps) {
  const inputId = id ?? `lp-textarea-${name ?? Math.random().toString(36).slice(2, 8)}`;
  return (
    <div className={`flex flex-col gap-2 flex-1 ${className}`}>
      {label && (
        <LPLabel htmlFor={inputId} surface={surface}>
          {label}
        </LPLabel>
      )}
      <textarea
        id={inputId}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={`lp-textarea lp-input--${surface}`}
      />
    </div>
  );
}

/* US phone number formatter — re-exported here so callers don't
   need to know about the legacy FormInput module. */
export function formatUsPhone(input: string): string {
  const digits = input.replace(/\D/g, "").slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6)
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}
