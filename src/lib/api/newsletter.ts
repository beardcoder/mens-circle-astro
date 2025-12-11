import pb from "../pocketbase";
import { Collections } from "../../types/pocketbase";
import type { NewsletterSubscriber } from "../../types/pocketbase";
import type { NewsletterSubscriberInput } from "../../types/pocketbase-schemas";

/**
 * Subscribe to newsletter
 */
export async function subscribeToNewsletter(
  data: NewsletterSubscriberInput
): Promise<NewsletterSubscriber> {
  try {
    const record = await pb.collection(Collections.NEWSLETTER).create(data);
    return record as unknown as NewsletterSubscriber;
  } catch (error: any) {
    // Handle duplicate email error
    if (error?.data?.email) {
      throw new Error("Diese E-Mail-Adresse ist bereits registriert");
    }
    throw new Error("Anmeldung fehlgeschlagen. Bitte versuche es später erneut.");
  }
}

/**
 * Check if email is already subscribed
 */
export async function isEmailSubscribed(email: string): Promise<boolean> {
  try {
    const records = await pb.collection(Collections.NEWSLETTER).getFullList({
      filter: `email = "${email}"`,
    });
    return records.length > 0;
  } catch (error) {
    console.error("Error checking email subscription:", error);
    return false;
  }
}
