import type { FunctionComponent } from "react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsletterSubscriberSchema } from "../types/pocketbase-schemas";
import { subscribeToNewsletter } from "../lib/api/newsletter";
import { z } from "zod";

type NewsletterFormProps = {
  privacyHref: string;
  className?: string;
};

const schema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "Bitte gib mindestens 2 Zeichen an."),
  lastName: z
    .string()
    .trim()
    .min(2, "Bitte gib mindestens 2 Zeichen an."),
  email: z.string().trim().email("Bitte gib eine gültige E-Mail-Adresse an."),
});

type FormValues = z.infer<typeof schema>;

const NewsletterForm: FunctionComponent<NewsletterFormProps> = ({
  privacyHref,
  className,
}) => {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const errorMessages = useMemo(
    () => Object.values(errors).map((error) => error.message).filter(Boolean),
    [errors],
  );

  const onSubmit = async (values: FormValues) => {
    try {
      setErrorMessage("");

      // Combine first and last name
      const fullName = `${values.firstName} ${values.lastName}`.trim();

      // Submit to PocketBase
      await subscribeToNewsletter({
        email: values.email,
        name: fullName,
      });

      setStatus("success");
      reset();
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(error.message || "Ein Fehler ist aufgetreten. Bitte versuche es später erneut.");
    }
  };

  const resetForm = () => {
    reset();
    setStatus("idle");
  };

  if (status === "success") {
    return (
      <div className="newsletter__success">
        <div className="newsletter__success-icon" aria-hidden="true">
          <svg
            fill="none"
            height="96"
            viewBox="0 0 72 72"
            width="96"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="36" cy="36" fill="#c17b5d" r="36" opacity="0.16" />
            <path
              d="m22 36.5 8.5 8.5L50 25"
              stroke="#c17b5d"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="5"
            />
          </svg>
        </div>
        <h3 className="newsletter__success-title">Danke für dein Vertrauen!</h3>
        <p className="newsletter__success-message">
          Du erhältst ab jetzt Inspirationen, Termine und Neuigkeiten direkt in
          dein Postfach.
        </p>
        <div className="newsletter__success-steps">
          <div className="newsletter__success-step">
            <span className="newsletter__success-step-number">1</span>
            <p>Schau in dein E-Mail-Postfach und bestätige deine Anmeldung.</p>
          </div>
          <div className="newsletter__success-step">
            <span className="newsletter__success-step-number">2</span>
            <p>Trage die Adresse auf deine Safe-List ein, damit nichts verloren geht.</p>
          </div>
        </div>
        <button className="newsletter__success-back" type="button" onClick={resetForm}>
          Zurück zum Formular
          <svg fill="none" height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 19 5 12l7-7M5 12h14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <form className={className ?? "newsletter__form"} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="newsletter__fields">
        <div className="newsletter__row">
          <div className="newsletter__field">
            <label className="sr-only" htmlFor="firstName">
              Vorname
            </label>
            <input
              autoComplete="given-name"
              className="newsletter__input"
              id="firstName"
              placeholder="Vorname"
              type="text"
              {...register("firstName")}
              aria-invalid={Boolean(errors.firstName)}
            />
          </div>
          <div className="newsletter__field">
            <label className="sr-only" htmlFor="lastName">
              Nachname
            </label>
            <input
              autoComplete="family-name"
              className="newsletter__input"
              id="lastName"
              placeholder="Nachname"
              type="text"
              {...register("lastName")}
              aria-invalid={Boolean(errors.lastName)}
            />
          </div>
        </div>
        <div className="newsletter__row">
          <div className="newsletter__field newsletter__field--email">
            <label className="sr-only" htmlFor="email">
              E-Mail
            </label>
            <input
              autoComplete="email"
              className="newsletter__input newsletter__input--email"
              id="email"
              inputMode="email"
              placeholder="deine@email.de"
              type="email"
              {...register("email")}
              aria-invalid={Boolean(errors.email)}
            />
          </div>
          <button
            aria-label="Newsletter abonnieren"
            className="newsletter__submit"
            disabled={isSubmitting}
            type="submit"
          >
            <svg
              aria-hidden="true"
              className="newsletter__icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M5 12h14M12 5l7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>
      </div>

      {(errorMessages.length > 0 || errorMessage) && (
        <div className="c-newsletter-form__error-container" aria-live="polite">
          {errorMessage && (
            <p className="c-newsletter-form__error-message">
              {errorMessage}
            </p>
          )}
          {errorMessages.map((message) => (
            <p className="c-newsletter-form__error-message" key={message}>
              {message}
            </p>
          ))}
        </div>
      )}

      <p className="newsletter__privacy">
        Mit der Anmeldung akzeptierst du unsere{" "}
        <a href={privacyHref}>Datenschutzbestimmungen</a>
      </p>
    </form>
  );
};

export default NewsletterForm;
