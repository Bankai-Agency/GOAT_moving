import Image from "next/image";
import Link from "next/link";

export type OtherServiceItem = {
  title: string;
  description: string;
  href: string;
  image?: string;
};

export type OtherServicesSectionProps = {
  label?: string;
  title?: string;
  services?: OtherServiceItem[];
};

const defaultServices: OtherServiceItem[] = [
  {
    title: "Long Distance Moving",
    description: "Moving out of state? We\u2019re licensed for interstate relocations.",
    href: "/long-distance-moving",
    image: "/images/service-longdistance.jpg",
  },
  {
    title: "Commercial Moving",
    description: "Office relocation? Minimal downtime, maximum care.",
    href: "/commercial-moving",
    image: "/images/service-commercial.png",
  },
  {
    title: "Packing Services",
    description: "Don\u2019t want to pack? We\u2019ll handle it.",
    href: "/packing-services",
    image: "/images/service-packing.png",
  },
];

export function OtherServicesSection({
  label = "Our Services",
  title = "Need More Than a Local Move?",
  services = defaultServices,
}: OtherServicesSectionProps = {}) {
  return (
    <section className="bg-[#0c0c0c] px-4 py-[60px] lg:py-[100px]">
      <div className="max-w-[1408px] mx-auto flex flex-col gap-10 lg:gap-16">
        {/* Section header */}
        <div className="flex flex-col gap-6 lg:gap-8">
          <div className="border-b border-white/16 pb-6">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#FFE533]" />
              <span className="font-mono font-bold text-base uppercase tracking-[-0.64px] leading-[1.2] text-white/60">
                {label}
              </span>
            </div>
          </div>
          <h2 className="font-sans font-bold text-[32px] lg:text-[64px] leading-[1.2] tracking-[-0.96px] lg:tracking-[-2.56px] text-white">
            {title}
          </h2>
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
          {services.map((service, i) => (
            <Link
              key={i}
              href={service.href}
              className="relative bg-[#181818] rounded-lg lg:rounded-2xl p-6 lg:p-8 flex flex-col justify-between gap-6 min-h-[180px] group overflow-hidden transition-colors duration-300"
            >
              {/* Background image — revealed on hover (desktop only) */}
              {service.image && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out pointer-events-none">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                    style={{ filter: "blur(6px)", transform: "scale(1.05)" }}
                  />
                  {/* Subtle dark tint */}
                  <div className="absolute inset-0 bg-black/20" />
                </div>
              )}

              <div className="relative z-10 flex flex-col gap-2">
                <h3 className="font-sans font-semibold text-xl lg:text-2xl leading-[1.2] tracking-[-0.6px] lg:tracking-[-0.72px] text-white">
                  {service.title}
                </h3>
                <p className="font-sans font-normal text-base leading-[1.5] tracking-[-0.48px] text-white/60 group-hover:text-white/80 transition-colors duration-300">
                  {service.description}
                </p>
              </div>
              <div className="relative z-10 flex items-center gap-2 font-mono font-bold text-sm uppercase tracking-[-0.64px] text-[#FFE533] group-hover:gap-3 transition-all duration-300">
                Learn More
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3l5 5-5 5" stroke="#FFE533" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
