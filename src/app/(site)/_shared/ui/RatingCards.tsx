import Image from "next/image";

const YELP_URL =
  "https://www.yelp.com/biz/goat-movers-vancouver?uid=rwbUOx3Y71juVHVrCkq2OQ&utm_source=ishare";
const GOOGLE_URL =
  "https://www.google.com/maps/place/GOAT+MOVERS/@45.5454821,-122.635238,10z/data=!3m1!4b1!4m6!3m5!1s0xa4790ebd1e7ffb07:0x697d406165de98a5!8m2!3d45.5454821!4d-122.635238!16s%2Fg%2F11wbt8363h?entry=ttu";

export type RatingCardsProps = {
  yelpRating?: string;
  googleRating?: string;
  yelpUrl?: string;
  googleUrl?: string;
};

function RatingCard({
  icon,
  iconBg,
  platform,
  rating,
  href,
}: {
  icon: string;
  iconBg: string;
  platform: string;
  rating: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="hidden lg:flex backdrop-blur-[15px] bg-[rgba(13,13,13,0.4)] h-[176px] w-[184px] p-6 rounded-[7px] hover:bg-[rgba(13,13,13,0.55)] hover-lift"
    >
      <div className="flex flex-col gap-[18px] w-full">
        <div className="flex items-center justify-center p-3 rounded-[4px] w-fit" style={{ backgroundColor: iconBg }}>
          <Image src={icon} alt={platform} width={24} height={24} />
        </div>
        <div className="flex flex-col gap-2 uppercase tracking-[-0.64px] text-white">
          <p className="font-mono font-bold text-base leading-[1.2]">{platform}</p>
          <p className="leading-[1.2]">
            <span className="font-sans font-medium text-[32px]">{rating}</span>
            <span className="font-sans font-medium text-base text-white/40">/5</span>
          </p>
        </div>
      </div>
    </a>
  );
}

function MobileRatingBar({
  yelpRating,
  googleRating,
  yelpUrl,
  googleUrl,
}: Required<Pick<RatingCardsProps, "yelpRating" | "googleRating" | "yelpUrl" | "googleUrl">>) {
  /* Two separate pills with a gap between — mirrors the desktop layout. */
  return (
    <div className="flex lg:hidden gap-2">
      <a
        href={yelpUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center gap-3 p-3 backdrop-blur-[15px] bg-[rgba(13,13,13,0.4)] rounded-[7px] hover:bg-[rgba(13,13,13,0.55)] transition-colors"
      >
        <div className="flex items-center justify-center p-2 rounded-[4px] shrink-0 bg-[#FF2828]">
          <Image src="/icons/yelp.svg" alt="Yelp" width={24} height={24} />
        </div>
        <div className="flex flex-col uppercase tracking-[-0.64px] text-white">
          <p className="font-mono font-bold text-xs leading-[1.2]">Yelp</p>
          <p className="leading-[1.2]">
            <span className="font-sans font-medium text-xl">{yelpRating}</span>
            <span className="font-sans font-medium text-xs text-white/40">/5</span>
          </p>
        </div>
      </a>
      <a
        href={googleUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center gap-3 p-3 backdrop-blur-[15px] bg-[rgba(13,13,13,0.4)] rounded-[7px] hover:bg-[rgba(13,13,13,0.55)] transition-colors"
      >
        <div className="flex items-center justify-center p-2 rounded-[4px] shrink-0 bg-[#357DFF]">
          <Image src="/icons/google.svg" alt="Google Maps" width={24} height={24} />
        </div>
        <div className="flex flex-col uppercase tracking-[-0.64px] text-white">
          <p className="font-mono font-bold text-xs leading-[1.2]">Google Maps</p>
          <p className="leading-[1.2]">
            <span className="font-sans font-medium text-xl">{googleRating}</span>
            <span className="font-sans font-medium text-xs text-white/40">/5</span>
          </p>
        </div>
      </a>
    </div>
  );
}

export function RatingCards({
  yelpRating = "4,79",
  googleRating = "4,98",
  yelpUrl = YELP_URL,
  googleUrl = GOOGLE_URL,
}: RatingCardsProps = {}) {
  return (
    <>
      <MobileRatingBar
        yelpRating={yelpRating}
        googleRating={googleRating}
        yelpUrl={yelpUrl}
        googleUrl={googleUrl}
      />
      <div className="hidden lg:flex gap-3">
        <RatingCard icon="/icons/yelp.svg" iconBg="#FF2828" platform="Yelp" rating={yelpRating} href={yelpUrl} />
        <RatingCard icon="/icons/google.svg" iconBg="#357DFF" platform="Google Maps" rating={googleRating} href={googleUrl} />
      </div>
    </>
  );
}
