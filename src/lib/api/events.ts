import pb from "@lib/pocketbase";
import { Collections } from "@app-types/pocketbase";
import type { Event, EventRegistration } from "@app-types/pocketbase";
import type { EventRegistrationInput } from "@app-types/pocketbase-schemas";

function mapToEvent(rec: Record<string, unknown>): Event {
  return {
    ...rec,
    slug: rec.slug,
    date: rec.date || rec.start_date || rec.created,
    status: rec.status || "published",
    time: rec.time || "19:00",
    location: rec.location || "TBD",
  } as Event;
}

export async function getPublishedEvents(): Promise<Event[]> {
  try {
    const records = await pb.collection(Collections.EVENTS).getFullList({ sort: "-created" });
    return records.map((r) => mapToEvent(r as Record<string, unknown>));
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

export async function getUpcomingEvents(): Promise<Event[]> {
  try {
    const today = new Date().toISOString().split("T")[0];
    const records = await pb.collection(Collections.EVENTS).getFullList({ sort: "+created" });
    return records
      .map((r) => mapToEvent(r as Record<string, unknown>))
      .filter((e) => e.status === "published" && e.date >= today);
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    return [];
  }
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  try {
    const record = await pb.collection(Collections.EVENTS).getFirstListItem(`slug="${slug}"`);
    return mapToEvent(record as Record<string, unknown>);
  } catch (error) {
    console.error(`Event not found: ${slug}`, error);
    return null;
  }
}

export async function getEventById(id: string): Promise<Event | null> {
  try {
    const record = await pb.collection(Collections.EVENTS).getOne(id);
    return mapToEvent(record as Record<string, unknown>);
  } catch (error) {
    console.error(`Event not found: ${id}`, error);
    return null;
  }
}

export async function registerForEvent(data: EventRegistrationInput): Promise<EventRegistration> {
  try {
    const event = await getEventById(data.eventId);

    if (!event) throw new Error("Event nicht gefunden");
    if (event.status === "full" || event.status === "cancelled") {
      throw new Error("Event nicht verfügbar");
    }
    if (
      event.maxParticipants &&
      event.currentParticipants &&
      event.currentParticipants >= event.maxParticipants
    ) {
      throw new Error("Event ausgebucht");
    }

    const existing = await pb.collection(Collections.EVENT_REGISTRATIONS).getFullList({
      filter: `eventId = "${data.eventId}" && email = "${data.email}"`,
    });

    if (existing.length > 0) throw new Error("Bereits angemeldet");

    const record = await pb.collection(Collections.EVENT_REGISTRATIONS).create(data);
    return record as unknown as EventRegistration;
  } catch (error: unknown) {
    if (error instanceof Error) throw error;
    throw new Error("Anmeldung fehlgeschlagen");
  }
}
