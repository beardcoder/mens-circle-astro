import { z } from "zod";

// Form validation schemas
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const newsletterSchema = z.object({
  email: z.string().regex(emailRegex, "Ungültige E-Mail"),
  name: z.string().min(2, "Mindestens 2 Zeichen").optional(),
});

export const eventRegistrationSchema = z.object({
  eventId: z.string().min(1),
  name: z.string().min(2, "Mindestens 2 Zeichen"),
  email: z.string().regex(emailRegex, "Ungültige E-Mail"),
  phone: z.string().optional(),
  message: z.string().max(500).optional(),
  status: z.enum(["pending", "confirmed", "cancelled"]).optional(),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type EventRegistrationInput = z.infer<typeof eventRegistrationSchema>;
