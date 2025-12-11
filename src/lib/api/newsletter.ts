import pb from "@lib/pocketbase";
import { Collections } from "@app-types/pocketbase";
import type { NewsletterSubscriber } from "@app-types/pocketbase";
import type { NewsletterInput } from "@app-types/pocketbase-schemas";

export async function subscribeToNewsletter(data: NewsletterInput): Promise<NewsletterSubscriber> {
  try {
    const record = await pb.collection(Collections.NEWSLETTER).create(data);
    return record as unknown as NewsletterSubscriber;
  } catch (error: unknown) {
    const err = error as { data?: { email?: string } };
    if (err?.data?.email) throw new Error("E-Mail bereits registriert");
    throw new Error("Anmeldung fehlgeschlagen");
  }
}
