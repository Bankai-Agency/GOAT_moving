"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday = 0
}

export function DatePicker({
  label,
  placeholder = "Choose date",
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (formatted: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number } | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  /* Compute viewport-fixed position for the calendar popover so it can escape
     parents with overflow:hidden / overflow:auto (modals, the LP hero, etc.).
     Auto-flips up when there isn't ~360px of space below the trigger. */
  const computePosition = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const POPOVER_HEIGHT = 360;
    const POPOVER_WIDTH = 300;
    const margin = 8;
    const spaceBelow = window.innerHeight - rect.bottom;
    const top =
      spaceBelow < POPOVER_HEIGHT + margin
        ? rect.top - POPOVER_HEIGHT - margin
        : rect.bottom + margin;
    /* Clamp left so the popover never overflows the viewport edges. */
    const left = Math.min(
      Math.max(margin, rect.left),
      window.innerWidth - POPOVER_WIDTH - margin
    );
    setPopoverPos({ top, left });
  };

  /* Re-position on open + on scroll/resize while open. */
  useEffect(() => {
    if (!isOpen) return;
    computePosition();
    const handler = () => computePosition();
    window.addEventListener("scroll", handler, { passive: true, capture: true });
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler, { capture: true });
      window.removeEventListener("resize", handler);
    };
  }, [isOpen]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      /* Allow clicks inside the trigger area AND inside the portal popover. */
      if (
        (ref.current && ref.current.contains(target)) ||
        (popoverRef.current && popoverRef.current.contains(target))
      ) {
        return;
      }
      setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const selectDate = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    setSelectedDate(date);
    onChange?.(formatDate(date));
    setIsOpen(false);
  };

  const formatDate = (date: Date) => {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      viewMonth === today.getMonth() &&
      viewYear === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      viewMonth === selectedDate.getMonth() &&
      viewYear === selectedDate.getFullYear()
    );
  };

  // Previous month trailing days
  const prevMonthDays = getDaysInMonth(
    viewMonth === 0 ? viewYear - 1 : viewYear,
    viewMonth === 0 ? 11 : viewMonth - 1
  );

  return (
    <div className="flex-1 min-w-0 flex flex-col gap-2 relative" ref={ref}>
      <label className="font-mono font-bold text-base leading-[1.2] tracking-[-0.64px] uppercase text-white/40">
        {label}
      </label>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="backdrop-blur-[20px] bg-white/10 rounded-[10px] h-[56px] lg:h-[57px] px-4 flex items-center justify-between cursor-pointer hover:bg-white/15 transition-all duration-200 ease-out text-left"
      >
        <span
          className={`font-sans font-normal text-lg leading-[1.4] tracking-[-0.36px] ${
            selectedDate ? "text-white" : "text-white/60"
          }`}
        >
          {selectedDate ? formatDate(selectedDate) : placeholder}
        </span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-60"
        >
          <rect x="2" y="4" width="16" height="14" rx="2" stroke="white" strokeWidth="1.5" />
          <path d="M2 8H18" stroke="white" strokeWidth="1.5" />
          <path d="M6 2V6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M14 2V6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {isOpen && popoverPos && typeof window !== "undefined" && createPortal(
        <div
          ref={popoverRef}
          className="fixed z-[300] w-[300px] backdrop-blur-[20px] bg-[rgba(20,20,20,0.96)] ring-1 ring-white/10 rounded-[10px] p-4 shadow-2xl animate-dropdown-in"
          style={{ top: popoverPos.top, left: popoverPos.left }}
        >
          {/* Header: month/year + arrows */}
          <div className="flex items-center justify-between mb-3">
            <span className="font-sans font-semibold text-base text-white">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={prevMonth}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
              >
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                  <path d="M6 1L1 6L6 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
              >
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                  <path d="M1 1L6 6L1 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Day names */}
          <div className="grid grid-cols-7 gap-0.5 mb-1">
            {DAYS.map((day) => (
              <div
                key={day}
                className="h-7 flex items-center justify-center font-sans font-medium text-[11px] uppercase text-white/30"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {/* Previous month trailing days */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div
                key={`prev-${i}`}
                className="h-8 flex items-center justify-center font-sans text-sm text-white/15 rounded-md"
              >
                {prevMonthDays - firstDay + 1 + i}
              </div>
            ))}

            {/* Current month days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const selected = isSelected(day);
              const todayDay = isToday(day);
              const isPast =
                new Date(viewYear, viewMonth, day) < today;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => selectDate(day)}
                  disabled={isPast}
                  className={`h-8 flex items-center justify-center font-sans text-sm rounded-md transition-all duration-150 ease-out cursor-pointer
                    ${selected
                      ? "bg-[#FFE533] text-black font-semibold scale-110"
                      : todayDay
                        ? "bg-white/10 text-white font-semibold"
                        : isPast
                          ? "text-white/15 cursor-default"
                          : "text-white hover:bg-white/10 hover:scale-110"
                    }`}
                >
                  {day}
                </button>
              );
            })}

            {/* Next month leading days */}
            {Array.from({
              length: Math.max(0, 42 - firstDay - daysInMonth),
            }).map((_, i) => (
              <div
                key={`next-${i}`}
                className="h-8 flex items-center justify-center font-sans text-sm text-white/15 rounded-md"
              >
                {i + 1}
              </div>
            ))}
          </div>

          {/* Footer: Today button */}
          <div className="mt-2 pt-2 border-t border-white/[0.08] flex justify-between">
            <button
              type="button"
              onClick={() => {
                setSelectedDate(null);
                onChange?.("");
                setIsOpen(false);
              }}
              className="font-mono text-xs uppercase text-white/40 hover:text-white/60 transition-colors cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMonth(today.getMonth());
                setViewYear(today.getFullYear());
                selectDate(today.getDate());
              }}
              className="font-mono text-xs uppercase text-[#FFE533] hover:text-[#FFE533]/80 transition-colors cursor-pointer"
            >
              Today
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
