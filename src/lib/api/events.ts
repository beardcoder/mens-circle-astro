import pb from "../pocketbase";
import { Collections } from "../../types/pocketbase";
import type { Event, EventRegistration } from "../../types/pocketbase";
import type { EventRegistrationInput } from "../../types/pocketbase-schemas";

/**
 * Get all published events
 */
export async function getPublishedEvents(): Promise<Event[]> {
  try {
    const records = await pb.collection(Collections.EVENTS).getFullList({
      filter: 'status = "published"',
      sort: "+date",
    });
    return records as unknown as Event[];
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

/**
 * Get upcoming events (published and in the future)
 */
export async function getUpcomingEvents(): Promise<Event[]> {
  try {
    const today = new Date().toISOString().split("T")[0];
    const records = await pb.collection(Collections.EVENTS).getFullList({
      filter: `status = "published" && date >= "${today}"`,
      sort: "+date",
    });
    return records as unknown as Event[];
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    return [];
  }
}

/**
 * Get event by slug
 */
export async function getEventBySlug(slug: string): Promise<Event | null> {
  try {
    const record = await pb.collection(Collections.EVENTS).getFirstListItem(`slug = "${slug}"`);
    return record as unknown as Event;
  } catch (error) {
    console.error(`Error fetching event with slug ${slug}:`, error);
    return null;
  }
}

/**
 * Get event by ID
 */
export async function getEventById(id: string): Promise<Event | null> {
  try {
    const record = await pb.collection(Collections.EVENTS).getOne(id);
    return record as unknown as Event;
  } catch (error) {
    console.error(`Error fetching event with id ${id}:`, error);
    return null;
  }
}

/**
 * Register for an event
 */
export async function registerForEvent(
  data: EventRegistrationInput
): Promise<EventRegistration> {
  try {
    // First, check if event is full
    const event = await getEventById(data.eventId);

    if (!event) {
      throw new Error("Event nicht gefunden");
    }

    if (event.status === "full") {
      throw new Error("Dieses Event ist bereits ausgebucht");
    }

    if (event.status === "cancelled") {
      throw new Error("Dieses Event wurde abgesagt");
    }

    if (
      event.maxParticipants &&
      event.currentParticipants &&
      event.currentParticipants >= event.maxParticipants
    ) {
      throw new Error("Dieses Event ist bereits ausgebucht");
    }

    // Check for duplicate registration
    const existingRegistration = await pb
      .collection(Collections.EVENT_REGISTRATIONS)
      .getFullList({
        filter: `eventId = "${data.eventId}" && email = "${data.email}"`,
      });

    if (existingRegistration.length > 0) {
      throw new Error("Du bist bereits für dieses Event angemeldet");
    }

    // Create registration
    const record = await pb.collection(Collections.EVENT_REGISTRATIONS).create(data);

    return record as unknown as EventRegistration;
  } catch (error: any) {
    if (error.message) {
      throw error;
    }
    throw new Error("Anmeldung fehlgeschlagen. Bitte versuche es später erneut.");
  }
}

/**
 * Get registrations for an event (admin use)
 */
export async function getEventRegistrations(eventId: string): Promise<EventRegistration[]> {
  try {
    const records = await pb.collection(Collections.EVENT_REGISTRATIONS).getFullList({
      filter: `eventId = "${eventId}"`,
      sort: "+created",
    });
    return records as unknown as EventRegistration[];
  } catch (error) {
    console.error(`Error fetching registrations for event ${eventId}:`, error);
    return [];
  }
}

/**
 * Get registration count for an event
 */
export async function getEventRegistrationCount(eventId: string): Promise<number> {
  try {
    const records = await pb.collection(Collections.EVENT_REGISTRATIONS).getFullList({
      filter: `eventId = "${eventId}" && status != "cancelled"`,
    });
    return records.length;
  } catch (error) {
    console.error(`Error fetching registration count for event ${eventId}:`, error);
    return 0;
  }
}
