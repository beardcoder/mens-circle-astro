import type { ImageMetadata } from "astro";

// Navigation
export type NavLink = {
  href: string;
  label: string;
};

// Content Types
export type HeroContent = {
  label: string;
  title: string;
  highlight: string;
  description: string;
  cta: { href: string; label: string };
  image: ImageMetadata;
};

export type FeatureCardContent = {
  id: string;
  label?: string;
  title: string;
  description: string;
  variant: "large" | "text";
  image?: ImageMetadata;
};

export type JourneyStep = {
  number: string;
  title: string;
  description: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type AboutSection = {
  id: string;
  title: string;
  subtitle: string;
  paragraphs: string[];
  image: ImageMetadata;
};

export type JourneySection = {
  id: string;
  title: string;
  description: string;
  steps: JourneyStep[];
  image: ImageMetadata;
};

export type QuoteContent = {
  text: string;
  author: string;
};

export type NewsletterContent = {
  label: string;
  title: string;
  description: string;
  privacyHref: string;
};
