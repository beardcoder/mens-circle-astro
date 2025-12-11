import { z } from "zod";

/**
 * Zod schemas for validating PocketBase data
 */

export const newsletterSubscriberSchema = z.object({
  email: z.string().email("Bitte gib eine gültige E-Mail-Adresse ein"),
  name: z.string().min(2, "Name muss mindestens 2 Zeichen lang sein").optional(),
});

export const eventSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  location: z.string().min(1),
  time: z.string().regex(/^\d{2}:\d{2}\s*-\s*\d{2}:\d{2}$/),
  maxParticipants: z.number().positive().optional(),
  currentParticipants: z.number().min(0).optional(),
  status: z.enum(["draft", "published", "cancelled", "full"]),
});

export const eventRegistrationSchema = z.object({
  eventId: z.string().min(1),
  name: z.string().min(2, "Name muss mindestens 2 Zeichen lang sein"),
  email: z.string().email("Bitte gib eine gültige E-Mail-Adresse ein"),
  phone: z.string().optional(),
  message: z.string().max(500, "Nachricht darf maximal 500 Zeichen lang sein").optional(),
  status: z.enum(["pending", "confirmed", "cancelled"]).optional().default("pending"),
});

export type NewsletterSubscriberInput = z.infer<typeof newsletterSubscriberSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type EventRegistrationInput = z.infer<typeof eventRegistrationSchema>;
