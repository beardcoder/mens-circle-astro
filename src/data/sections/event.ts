import type { EventContent } from "../../types";
import { eventContentSchema } from "../../types/schemas";

const rawNextEvent = {
  slug: "21-12-2025",
  title: "Männerkreis",
  description:
    "Männerkreis am 21.12.2025 – Keine Fassaden, nur echte Männerarbeit. Zeig dich authentisch, arbeite mit den Archetypen des reifen Mannes und wachse in Bruderschaft. Jetzt anmelden.",
  date: "2025-12-21",
  location: "Raum & Zeit - Am Wirtsberg 6a",
  time: "19:00 - 22:00",
  ctaHref: "/events/21-12-2025",
  ctaLabel: "Jetzt anmelden",
};

export const nextEvent = eventContentSchema.parse(rawNextEvent) as EventContent;
