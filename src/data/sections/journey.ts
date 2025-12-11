import type { JourneySection } from "../../types";
import journeyImage from "../../assets/images/journey-group.webp";

export const journey: JourneySection = {
  id: "c25",
  title: "Vom Ich zum Wir",
  description:
    "In unserer modernen Welt haben viele Männer den Kontakt zu sich selbst und zu anderen Männern verloren. Der Männerkreis ist ein Weg zurück zur Essenz – zu dem, was wirklich zählt.",
  steps: [
    {
      number: "10",
      title: "Ankommen",
      description: "Nimm Platz im Kreis und lass den Alltag hinter dir.",
    },
    {
      number: "20",
      title: "Öffnen",
      description: "Teile deine Geschichte in einem sicheren Raum.",
    },
    {
      number: "30",
      title: "Wachsen",
      description: "Erkenne deine Muster und entdecke neue Wege.",
    },
    {
      number: "40",
      title: "Integrieren",
      description: "Trage die Kraft des Kreises in dein Leben hinaus.",
    },
  ],
  image: journeyImage,
};
