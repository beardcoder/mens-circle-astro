/**
 * PocketBase Collection Types
 *
 * These types represent the structure of your PocketBase collections.
 * Update these to match your actual PocketBase schema.
 */

export interface NewsletterSubscriber {
  id?: string;
  email: string;
  name?: string;
  created?: string;
  updated?: string;
}

export interface Event {
  id?: string;
  slug: string;
  title: string;
  description: string;
  date: string; // ISO date string
  location: string;
  time: string; // e.g., "19:00 - 22:00"
  maxParticipants?: number;
  currentParticipants?: number;
  status: "draft" | "published" | "cancelled" | "full";
  created?: string;
  updated?: string;
}

export interface EventRegistration {
  id?: string;
  eventId: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  status: "pending" | "confirmed" | "cancelled";
  created?: string;
  updated?: string;
}

/**
 * Collection names - use these constants to avoid typos
 */
export const Collections = {
  NEWSLETTER: "newsletter_subscribers",
  EVENTS: "events",
  EVENT_REGISTRATIONS: "event_registrations",
} as const;
