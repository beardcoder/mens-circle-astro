import { z } from "zod";

export const navLinkSchema = z.object({
  href: z.string().url().or(z.string().regex(/^\/|^#/)),
  label: z.string().min(1),
});

export const heroContentSchema = z.object({
  label: z.string().min(1),
  title: z.string().min(1),
  highlight: z.string().min(1),
  description: z.string().min(1),
  cta: z.object({
    href: z.string(),
    label: z.string().min(1),
  }),
  image: z.any(), // ImageMetadata from Astro
});

export const featureCardContentSchema = z.object({
  id: z.string().min(1),
  label: z.string().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  variant: z.enum(["large", "text"]),
  image: z.any().optional(), // ImageMetadata from Astro
});

export const eventContentSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  location: z.string().min(1),
  time: z.string().regex(/^\d{2}:\d{2}\s*-\s*\d{2}:\d{2}$/),
  ctaHref: z.string(),
  ctaLabel: z.string().min(1),
});

export const journeyStepSchema = z.object({
  number: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

export const faqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const aboutSectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  paragraphs: z.array(z.string().min(1)),
  image: z.any(), // ImageMetadata from Astro
});

export const journeySectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  steps: z.array(journeyStepSchema),
  image: z.any(), // ImageMetadata from Astro
});

export const quoteContentSchema = z.object({
  text: z.string().min(1),
  author: z.string().min(1),
});

export const newsletterContentSchema = z.object({
  label: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  privacyHref: z.string(),
});
