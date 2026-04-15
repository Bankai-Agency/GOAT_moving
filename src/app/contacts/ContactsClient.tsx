"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { ContactFooter } from "@/components/sections/ContactFooter";
import { Touchbar } from "@/components/layout/Touchbar";
import { QuoteModal } from "@/components/ui/QuoteModal";

function PhoneIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.512 17.249a2.26 2.26 0 0 0-.803-.95l-3.32-2.358a4.6 4.6 0 0 0-.84-.465 2.13 2.13 0 0 0-1.952.11 3.8 3.8 0 0 0-.9.69l-.72.671a6.8 6.8 0 0 1-1.157-.83 28 28 0 0 1-1.54-1.423c-.461-.47-.925-.975-1.412-1.54a8 8 0 0 1-.819-1.106l-.025-.068.682-.71a4.1 4.1 0 0 0 .67-.85 2.1 2.1 0 0 0 .319-1.1 2.3 2.3 0 0 0-.195-.894 4 4 0 0 0-.484-.85L7.701 2.312a2.4 2.4 0 0 0-.963-.81 2.6 2.6 0 0 0-1.133-.252A3.65 3.65 0 0 0 3.01 2.395 5.34 5.34 0 0 0 1.68 4.33a5.9 5.9 0 0 0-.415 2.209 9.2 9.2 0 0 0 .78 3.564 18.8 18.8 0 0 0 2.043 3.557 29.4 29.4 0 0 0 2.87 3.362 30 30 0 0 0 3.366 2.873 18.3 18.3 0 0 0 3.588 2.063 9.1 9.1 0 0 0 3.553.79 5.8 5.8 0 0 0 2.235-.435 5.2 5.2 0 0 0 1.91-1.37 4.8 4.8 0 0 0 .803-1.204 3.3 3.3 0 0 0 .322-1.41 2.8 2.8 0 0 0-.223-1.081zm-1.456 1.85a3.3 3.3 0 0 1-.556.837 3.76 3.76 0 0 1-1.373.992 5.97 5.97 0 0 1-4.627-.349 16.8 16.8 0 0 1-3.292-1.894 28 28 0 0 1-3.19-2.722 28 28 0 0 1-2.714-3.18A17.2 17.2 0 0 1 3.426 9.52a7.7 7.7 0 0 1-.66-2.98 4.4 4.4 0 0 1 .308-1.656 3.9 3.9 0 0 1 .976-1.41 2.2 2.2 0 0 1 1.555-.724 1.15 1.15 0 0 1 .496.11.9.9 0 0 1 .373.314l2.323 3.275a2.7 2.7 0 0 1 .319.556.9.9 0 0 1 .079.315.65.65 0 0 1-.112.341 2.8 2.8 0 0 1-.449.56l-.747.777a1.28 1.28 0 0 0-.382.932 1.8 1.8 0 0 0 .078.496l.124.296a9 9 0 0 0 1.021 1.408 35 35 0 0 0 1.491 1.625 30 30 0 0 0 1.631 1.507 8.5 8.5 0 0 0 1.424 1.011l.266.118a1.41 1.41 0 0 0 1.453-.296l.762-.754a2.4 2.4 0 0 1 .578-.45.53.53 0 0 1 .648-.027 3 3 0 0 1 .55.308l3.317 2.355a.76.76 0 0 1 .281.303 1.3 1.3 0 0 1 .106.5 1.8 1.8 0 0 1-.179.77z" fill="#FFE533"/>
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="20" height="16" rx="3" stroke="#FFE533" strokeWidth="1.5"/>
      <path d="M2 7L12 13L22 7" stroke="#FFE533" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="#FFE533" strokeWidth="1.5"/>
      <path d="M12 22C16 18 20 14.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 14.4183 8 18 12 22Z" stroke="#FFE533" strokeWidth="1.5"/>
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="#FFE533" strokeWidth="1.5"/>
      <path d="M12 6V12L16 14" stroke="#FFE533" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ContactsHeroWithCards() {
  const contacts = [
    { icon: <PhoneIcon />, label: "Phone", value: "+1 (380) 524-0846", href: "tel:+13805240846" },
    { icon: <EmailIcon />, label: "Email", value: "info@goatmovers.com", href: "mailto:info@goatmovers.com" },
    { icon: <LocationIcon />, label: "Address", value: "1178 Dock St, Tacoma, WA 98402\n8101 NE 14th Pl, Portland, OR 97211", href: "https://maps.google.com/?q=1178+Dock+St+Tacoma+WA+98402" },
    { icon: <ClockIcon />, label: "Hours", value: "Mon–Sun, 8 AM – 6 PM", href: null },
  ];

  return (
    <section className="bg-[#0c0c0c] px-4 pt-[120px] lg:pt-[150px] pb-[60px] lg:pb-[80px]">
      <div className="max-w-[1408px] mx-auto flex flex-col gap-10 lg:gap-14">
        <div className="flex flex-col gap-4 lg:gap-5">
          <h1 className="font-sans font-bold text-[36px] lg:text-[72px] leading-none tracking-[-1.08px] lg:tracking-[-2.16px]">
            <span className="text-white/60">Get In </span>
            <span className="text-white">Touch</span>
          </h1>
          <p className="font-sans font-normal text-base lg:text-xl leading-[1.4] tracking-[-0.48px] lg:tracking-[-0.6px] text-white/60 max-w-[540px]">
            Ready to move? Give us a call or fill out the form in the footer for a free estimate.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {contacts.map((c, i) => {
            const inner = (
              <div className="bg-[#181818] rounded-xl lg:rounded-2xl p-5 lg:p-6 flex flex-col gap-4 group hover:bg-[#1e1e1e] transition-colors duration-300 h-full">
                <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-lg lg:rounded-xl bg-[#242424] flex items-center justify-center shadow-[0px_0px_6px_0px_rgba(0,0,0,0.02),0px_2px_4px_0px_rgba(0,0,0,0.08)] group-hover:scale-105 transition-transform duration-300">
                  {c.icon}
                </div>
                <span className="font-mono font-bold text-xs uppercase tracking-[-0.56px] text-white/30">
                  {c.label}
                </span>
                <span className="font-sans font-semibold text-lg lg:text-xl leading-[1.2] tracking-[-0.54px] lg:tracking-[-0.6px] text-white whitespace-pre-line">
                  {c.value}
                </span>
              </div>
            );
            return c.href ? (
              <a key={i} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}>
                {inner}
              </a>
            ) : (
              <div key={i}>{inner}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MapSection() {
  return (
    <section className="bg-[#0c0c0c] px-4 pb-[60px] lg:pb-[100px]">
      <div className="max-w-[1408px] mx-auto">
        <div className="relative w-full h-[300px] lg:h-[450px] rounded-xl lg:rounded-2xl overflow-hidden">
          <iframe
            src="https://maps.google.com/maps?q=1178+Dock+St,+Tacoma,+WA+98402&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) saturate(0.4) brightness(1.2)" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="GOAT Movers location"
          />
        </div>
      </div>
    </section>
  );
}

export default function ContactsClient() {
  return (
    <>
      <Header />
      <ContactsHeroWithCards />
      <MapSection />
      <ContactFooter />
      <Touchbar />
      <QuoteModal />
    </>
  );
}
