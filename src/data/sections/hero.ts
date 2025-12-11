import type { HeroContent } from "../../types";
import { heroContentSchema } from "../../types/schemas";
import heroImage from "../../assets/images/csm_colton-duke-isk6rrk48yq-unsplash_3e2c5ff64e.webp";

const rawHeroContent = {
  label: "AUTHENTISCH",
  title: "DIE KRAFT DER",
  highlight: "MÄNNER\u00adGEMEINSCHAFT",
  description:
    "Du stehst beruflich gut da, hast Familie oder Freundin, und trotzdem fehlt etwas. Die Gespräche bleiben an der Oberfläche - Sport, Arbeit, das war's. Wo kannst du in Niederbayern über das reden, was dich wirklich bewegt? Im Männerkreis Straubing triffst du andere Männer, die wie du mehr wollen als Small Talk. Hier kannst du authentisch sein, ohne dich rechtfertigen zu müssen. Monatliche Treffen. Echter Austausch. Gemeinsames Wachstum.",
  cta: {
    href: "/events/21-12-2025",
    label: "Nächstes Treffen →",
  },
  image: heroImage,
};

export const heroContent = heroContentSchema.parse(rawHeroContent) as HeroContent;
