import type { PartnerLogo } from "@/lib/partner-logos";

import { HeroSectionClient } from "./HeroSectionClient";

const HERO_LOGOS: PartnerLogo[] = [
  { alt: "Beeline", filename: "beeline.svg", src: "/hero-logos/beeline.svg" },
  { alt: "Rusal", filename: "rusal.svg", src: "/hero-logos/rusal.svg" },
  {
    alt: "Mintsifry",
    filename: "mintsifry.svg",
    src: "/hero-logos/mintsifry.svg",
  },
  { alt: "Vtb", filename: "vtb.svg", src: "/hero-logos/vtb.svg" },
  { alt: "Tbank", filename: "tbank.svg", src: "/hero-logos/tbank.svg" },
  { alt: "Rosatom", filename: "rosatom.svg", src: "/hero-logos/rosatom.svg" },
];

export function HeroSection() {
  return <HeroSectionClient logos={HERO_LOGOS} />;
}
