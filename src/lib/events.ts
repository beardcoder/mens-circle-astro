import type { ImageMetadata } from "astro";
import eventHeroImage from "../assets/images/csm_colton-duke-isk6rrk48yq-unsplash_3e2c5ff64e.webp";

export type EventApiResponse = {
  collectionId: string;
  collectionName: string;
  id: string;
  title: string;
  description: string;
  image: string;
  start_date: string;
  end_date: string;
  location: string;
  created: string;
  updated: string;
};

export type LocationApiResponse = {
  collectionId: string;
  collectionName: string;
  id: string;
  title: string;
  address: string;
  zip: string;
  city: string;
  geo: {
    lon: number;
    lat: number;
  };
  created: string;
  updated: string;
};

export type EventWithLocation = EventApiResponse & {
  locationData: LocationApiResponse;
};

// Placeholder data until the real API is wired in.
const fallbackEvent: EventApiResponse = {
  collectionId: "pbc_1687431684",
  collectionName: "events",
  id: "21-12-2025",
  title: "Männerkreis",
  description:
    "Männerkreis am 21.12.2025 – Keine Fassaden, nur echte Männerarbeit. Zeig dich authentisch, arbeite mit den Archetypen des reifen Mannes und wachse in Bruderschaft. Jetzt anmelden.",
  image: "filename.jpg",
  start_date: "2025-12-21T19:00:00.000Z",
  end_date: "2025-12-21T22:00:00.000Z",
  location: "test",
  created: "2025-01-01T10:00:00.000Z",
  updated: "2025-01-01T10:00:00.000Z",
};

const fallbackLocation: LocationApiResponse = {
  collectionId: "pbc_1942858786",
  collectionName: "locations",
  id: "test",
  title: "Raum & Zeit",
  address: "Am Wirtsberg 6a",
  zip: "94315",
  city: "Straubing",
  geo: { lon: 0, lat: 0 },
  created: "2025-01-01T10:00:00.000Z",
  updated: "2025-01-01T10:00:00.000Z",
};

export async function getEventBySlug(slug: string): Promise<EventWithLocation> {
  // TODO: Replace with real API calls once available.
  // This function currently returns a fallback event to keep the page working.
  const normalizedSlug = slug || fallbackEvent.id;
  const event = { ...fallbackEvent, id: normalizedSlug };
  return {
    ...event,
    locationData: fallbackLocation,
  };
}
