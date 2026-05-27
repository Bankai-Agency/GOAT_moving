"use client";

import { useState, useRef, useEffect } from "react";
import { LPLabel, type LPSurface } from "./LPInput";

/* SelectDropdown — surface-aware (light | glass) to match LPInput.
   Uses the same `.lp-input lp-input--${surface}` classes for the
   trigger so the field reads identically to neighbouring inputs.
   The popover panel and option states swap palette by surface. */

export function SelectDropdown({
  label,
  placeholder = "Select",
  options,
  value,
  onChange,
  surface = "light",
}: {
  label: string;
  placeholder?: string;
  options: string[];
  value?: string;
  onChange?: (val: string) => void;
  surface?: LPSurface;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(value ?? null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isLight = surface === "light";

  const placeholderColor = isLight ? "rgba(0, 31, 77, 0.4)" : "rgba(255, 255, 255, 0.55)";
  const valueColor = isLight ? "#001f4d" : "#ffffff";
  const chevronStroke = isLight ? "#001f4d" : "#ffffff";
  const chevronOpacity = isLight ? 0.55 : 0.6;

  const panelClass = isLight
    ? "bg-white ring-1 ring-black/10 shadow-xl"
    : "backdrop-blur-[20px] bg-[rgba(20,20,20,0.96)] ring-1 ring-white/10 shadow-2xl";

  const optionBase = "w-full text-left px-3 py-2 rounded-[6px] font-sans font-normal text-base leading-[1.4] tracking-[-0.3px] transition-all duration-150 ease-out cursor-pointer";
  const optionIdle = isLight
    ? "text-[#001f4d] hover:bg-[#f1f3f6]"
    : "text-white hover:bg-white/10 hover:pl-4";
  const optionSelected = isLight
    ? "text-[#0066ff] bg-[#eef3ff]"
    : "text-[#FFE533] bg-white/10";

  return (
    <div className="flex-1 min-w-0 flex flex-col gap-2 relative" ref={ref}>
      <LPLabel surface={surface}>{label}</LPLabel>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`lp-input lp-input--${surface} flex items-center justify-between text-left`}
        style={{ color: selected ? valueColor : placeholderColor }}
      >
        <span className="truncate">
          {selected || placeholder}
        </span>
        <svg
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          style={{ opacity: chevronOpacity }}
        >
          <path d="M1 1.5L6 6.5L11 1.5" stroke={chevronStroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <div className={`absolute top-full left-0 right-0 mt-2 z-[100] rounded-[10px] p-2 flex flex-col gap-0.5 animate-dropdown-in ${panelClass}`}>
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                setSelected(option);
                onChange?.(option);
                setIsOpen(false);
              }}
              className={`${optionBase} ${selected === option ? optionSelected : optionIdle}`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
