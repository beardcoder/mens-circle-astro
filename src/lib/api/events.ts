import pb from "@lib/pocketbase";
import { Collections } from "@app-types/pocketbase";
import type { Event, EventRegistration } from "@app-types/pocketbase";
import type { EventRegistrationInput } from "@app-types/pocketbase-schemas";

export async function getUpcomingEvents(): Promise<Event[]> {
  try {
    return await pb
      .collection<Event>(Collections.EVENTS)
      .getFullList({ sort: "+start_date", expand: "location" });
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    return [];
  }
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  try {
    return await pb
      .collection<Event>(Collections.EVENTS)
      .getFirstListItem(`slug="${slug}"`, { expand: "location" });
  } catch (error) {
    console.error(`Event not found: ${slug}`, error);
    return null;
  }
}

export async function getEventById(id: string): Promise<Event | null> {
  try {
    return await pb.collection<Event>(Collections.EVENTS).getOne(id, { expand: "location" });
  } catch (error) {
    console.error(`Event not found: ${id}`, error);
    return null;
  }
}

export async function registerForEvent(data: EventRegistrationInput): Promise<EventRegistration> {
  try {
    const event = await getEventById(data.eventId);

    if (!event) throw new Error("Event nicht gefunden");

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
