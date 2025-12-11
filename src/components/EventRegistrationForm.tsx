import type { FunctionComponent } from "react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventRegistrationSchema } from "../types/pocketbase-schemas";
import { registerForEvent } from "../lib/api/events";
import { z } from "zod";

type EventRegistrationFormProps = {
  eventId: string;
  eventTitle: string;
  privacyHref?: string;
  className?: string;
};

// Form-specific type (without status field in the form)
type EventRegistrationFormData = {
  eventId: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
};

const EventRegistrationForm: FunctionComponent<EventRegistrationFormProps> = ({
  eventId,
  eventTitle,
  privacyHref = "/datenschutz",
  className,
}) => {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventRegistrationFormData>({
    resolver: zodResolver(
      z.object({
        eventId: z.string().min(1),
        name: z.string().min(2, "Name muss mindestens 2 Zeichen lang sein"),
        email: z.string().email("Bitte gib eine gültige E-Mail-Adresse ein"),
        phone: z.string().optional(),
        message: z.string().max(500, "Nachricht darf maximal 500 Zeichen lang sein").optional(),
      })
    ),
    mode: "onBlur",
    defaultValues: {
      eventId,
    },
  });

  const errorMessages = useMemo(
    () => Object.values(errors).map((error) => error.message).filter(Boolean),
    [errors],
  );

  const onSubmit = async (values: EventRegistrationFormData) => {
    try {
      setErrorMessage("");

      // Add status field for API submission
      await registerForEvent({
        ...values,
        status: "pending",
      });

      setStatus("success");
      reset();
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(error.message || "Anmeldung fehlgeschlagen. Bitte versuche es später erneut.");
    }
  };

  const resetForm = () => {
    reset({ eventId });
    setStatus("idle");
    setErrorMessage("");
  };

  if (status === "success") {
    return (
      <div className="event-registration__success">
        <div className="event-registration__success-icon" aria-hidden="true">
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
        <h3 className="event-registration__success-title">Anmeldung erfolgreich!</h3>
        <p className="event-registration__success-message">
          Deine Anmeldung für <strong>{eventTitle}</strong> wurde erfolgreich übermittelt.
          Du erhältst in Kürze eine Bestätigung per E-Mail.
        </p>
        <button
          className="event-registration__success-back"
          type="button"
          onClick={resetForm}
        >
          Weitere Anmeldung
        </button>
      </div>
    );
  }

  return (
    <form className={className ?? "event-registration__form"} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="event-registration__fields">
        <div className="event-registration__field">
          <label htmlFor="name">
            Name <span aria-label="Pflichtfeld">*</span>
          </label>
          <input
            autoComplete="name"
            className="event-registration__input"
            id="name"
            placeholder="Dein vollständiger Name"
            type="text"
            {...register("name")}
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name && (
            <p className="event-registration__error">{errors.name.message}</p>
          )}
        </div>

        <div className="event-registration__field">
          <label htmlFor="email">
            E-Mail <span aria-label="Pflichtfeld">*</span>
          </label>
          <input
            autoComplete="email"
            className="event-registration__input"
            id="email"
            inputMode="email"
            placeholder="deine@email.de"
            type="email"
            {...register("email")}
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && (
            <p className="event-registration__error">{errors.email.message}</p>
          )}
        </div>

        <div className="event-registration__field">
          <label htmlFor="phone">
            Telefon <span className="event-registration__optional">(optional)</span>
          </label>
          <input
            autoComplete="tel"
            className="event-registration__input"
            id="phone"
            inputMode="tel"
            placeholder="+49 123 456789"
            type="tel"
            {...register("phone")}
            aria-invalid={Boolean(errors.phone)}
          />
          {errors.phone && (
            <p className="event-registration__error">{errors.phone.message}</p>
          )}
        </div>

        <div className="event-registration__field">
          <label htmlFor="message">
            Nachricht <span className="event-registration__optional">(optional)</span>
          </label>
          <textarea
            className="event-registration__textarea"
            id="message"
            placeholder="Hast du Fragen oder Anmerkungen?"
            rows={4}
            {...register("message")}
            aria-invalid={Boolean(errors.message)}
          />
          {errors.message && (
            <p className="event-registration__error">{errors.message.message}</p>
          )}
        </div>
      </div>

      {(errorMessages.length > 0 || errorMessage) && (
        <div className="event-registration__error-container" aria-live="polite">
          {errorMessage && (
            <p className="event-registration__error-message">
              {errorMessage}
            </p>
          )}
          {errorMessages.map((message) => (
            <p className="event-registration__error-message" key={message}>
              {message}
            </p>
          ))}
        </div>
      )}

      <p className="event-registration__privacy">
        Mit der Anmeldung akzeptierst du unsere{" "}
        <a href={privacyHref}>Datenschutzbestimmungen</a>
      </p>

      <button
        className="event-registration__submit"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Wird gesendet..." : "Jetzt anmelden"}
      </button>
    </form>
  );
};

export default EventRegistrationForm;
