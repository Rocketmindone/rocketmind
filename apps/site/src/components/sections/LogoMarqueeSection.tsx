import { getPartnerLogos } from "@/lib/partner-logos";
import { LogoMarqueeSectionClient } from "./LogoMarqueeSectionClient";

export async function LogoMarqueeSection({ noBorder }: { noBorder?: boolean } = {}) {
  const logos = await getPartnerLogos();
  return <LogoMarqueeSectionClient logos={logos} noBorder={noBorder} />;
}
