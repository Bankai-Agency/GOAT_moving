"use client";

import { useState, useRef, useEffect } from "react";

export function SelectDropdown({
  label,
  placeholder = "Select",
  options,
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  options: string[];
  value?: string;
  onChange?: (val: string) => void;
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

  return (
    <div className="flex-1 min-w-0 flex flex-col gap-2 relative" ref={ref}>
      <label className="font-mono font-bold text-base leading-[1.2] tracking-[-0.64px] uppercase text-white/40">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="backdrop-blur-[20px] bg-white/10 rounded-[10px] h-[56px] lg:h-[57px] px-4 flex items-center justify-between cursor-pointer hover:bg-white/15 transition-all duration-200 ease-out text-left"
      >
        <span
          className={`font-sans font-normal text-lg leading-[1.4] tracking-[-0.36px] ${
            selected ? "text-white" : "text-white/60"
          }`}
        >
          {selected || placeholder}
        </span>
        <svg
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`opacity-60 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          <path d="M1 1.5L6 6.5L11 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 backdrop-blur-[15px] bg-[rgba(13,13,13,0.4)] rounded-[7px] p-2 flex flex-col gap-0.5 shadow-2xl animate-dropdown-in">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                setSelected(option);
                onChange?.(option);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-[5px] font-sans font-normal text-base leading-[1.4] tracking-[-0.36px] transition-all duration-150 ease-out cursor-pointer ${
                selected === option
                  ? "text-[#FFE533] bg-white/10"
                  : "text-white hover:bg-white/10 hover:pl-4"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
