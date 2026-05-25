"use client";

/**
 * Unified post-submit confirmation shown after any quote / contact form is sent.
 * Dark-brand version of the classic "Success" card — yellow checkmark-in-bubble,
 * bold heading, muted body, yellow CTA.
 */
export function SuccessState({
  heading = "Request Submitted Successfully!",
  body = "Our team will review your request and get back to you within 24 hours with a personalized quote.",
  buttonLabel = "Continue",
  onButtonClick,
}: {
  heading?: string;
  body?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-5 py-8 px-2">
      {/* Certified-check badge icon (starburst border with checkmark inside) */}
      <div className="w-[88px] h-[88px] flex items-center justify-center drop-shadow-[0_12px_30px_rgba(255,229,51,0.35)]">
        <svg width="88" height="88" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="m61.49 31.13c-2.25-1.26-3.86-3.33-4.53-5.82s-.31-5.08 1.01-7.3c.19-.31.19-.7.01-1.01s-.51-.5-.87-.5h-.15c-2.53 0-4.9-.98-6.69-2.77-1.82-1.83-2.81-4.25-2.77-6.83 0-.36-.19-.7-.5-.88s-.7-.18-1.01.01c-2.22 1.32-4.81 1.68-7.3 1.01s-4.56-2.28-5.82-4.53c-.35-.63-1.39-.63-1.74 0-1.26 2.25-3.33 3.86-5.82 4.53s-5.08.31-7.3-1.01c-.31-.19-.69-.19-1.01-.01-.31.18-.5.52-.5.88.04 2.58-.95 5-2.77 6.83-1.79 1.79-4.16 2.77-6.69 2.77h-.14c-.33-.02-.7.19-.88.5s-.18.7.01 1.01c1.32 2.22 1.68 4.81 1.01 7.3s-2.28 4.56-4.53 5.82c-.31.17-.51.51-.51.87s.2.7.51.87c2.25 1.26 3.86 3.33 4.53 5.82s.31 5.08-1.01 7.3c-.19.31-.19.7-.01 1.01s.56.5.88.5c2.61-.06 5 .95 6.83 2.77 1.82 1.83 2.81 4.25 2.77 6.83 0 .36.19.7.5.88.32.18.7.18 1.01-.01 2.22-1.32 4.81-1.68 7.3-1.01s4.56 2.28 5.82 4.53c.17.31.51.51.87.51s.7-.2.87-.51c1.26-2.25 3.33-3.86 5.82-4.53s5.08-.31 7.3 1.01c.31.19.7.19 1.01.01s.5-.52.5-.88c-.04-2.58.95-5 2.77-6.83 1.79-1.79 4.16-2.77 6.69-2.77h.15c.36 0 .69-.19.87-.5s.18-.7-.01-1.01c-1.32-2.22-1.68-4.81-1.01-7.3s2.28-4.56 4.53-5.82c.31-.17.51-.51.51-.87s-.2-.7-.51-.87z"
            fill="#FFE533"
          />
          <path
            d="m40.87 22.16c-.39-.39-1.03-.39-1.42 0l-9.66 9.66-5.25-5.24c-.39-.39-1.02-.39-1.41 0l-3.95 3.95c-.19.18-.29.44-.29.7 0 .27.1.52.29.71l9.9 9.9c.2.2.46.29.71.29.26 0 .51-.09.71-.29l14.32-14.32c.19-.19.29-.44.29-.71 0-.26-.1-.52-.29-.7z"
            fill="#0c0c0c"
          />
        </svg>
      </div>

      <h3 className="font-sans font-bold text-2xl lg:text-[28px] leading-[1.2] tracking-[-0.72px] lg:tracking-[-0.84px] text-white max-w-[360px]">
        {heading}
      </h3>

      <p className="font-sans font-normal text-base leading-[1.5] tracking-[-0.48px] text-white/60 max-w-[380px]">
        {body}
      </p>

      {onButtonClick && (
        <button
          onClick={onButtonClick}
          className="btn-shine bg-[#FFE533] h-[48px] lg:h-[52px] w-full lg:w-auto lg:px-10 rounded-lg font-mono font-bold text-sm lg:text-base uppercase tracking-[-0.64px] leading-[1.2] text-[#0c0c0c] hover:bg-[#f0d820] hover:shadow-[0_4px_20px_rgba(255,229,51,0.35)] hover:scale-[1.02] transition-all duration-300 ease-out cursor-pointer mt-2"
        >
          {buttonLabel}
        </button>
      )}
    </div>
  );
}
