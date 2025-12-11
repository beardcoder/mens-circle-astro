<script lang="ts">
  import { z } from "zod";
  import { superForm } from "sveltekit-superforms";
  import { zod } from "sveltekit-superforms/adapters";
  import { subscribeToNewsletter } from "@lib/api/newsletter";

  export let privacyHref: string;
  export let className: string | undefined = undefined;

  const schema = z.object({
    firstName: z.string().trim().min(2, "Bitte gib mindestens 2 Zeichen an."),
    lastName: z.string().trim().min(2, "Bitte gib mindestens 2 Zeichen an."),
    email: z.string().trim().min(1).regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Bitte gib eine gültige E-Mail-Adresse an."),
  });

  let status: "idle" | "success" | "error" = "idle";
  let errorMessage = "";

  const { form, errors, enhance, delayed } = superForm(
    { firstName: "", lastName: "", email: "" },
    {
      validators: zod(schema),
      SPA: true,
      async onUpdate({ form }) {
        if (!form.valid) {
          status = "error";
          errorMessage = "";
          return;
        }

        try {
          const fullName = `${form.data.firstName} ${form.data.lastName}`.trim();
          await subscribeToNewsletter({
            email: form.data.email,
            name: fullName,
          });
          status = "success";
        } catch (error: any) {
          status = "error";
          errorMessage = error?.message || "Ein Fehler ist aufgetreten. Bitte versuche es später erneut.";
        }
      },
    }
  );

  const resetForm = () => {
    $form = { firstName: "", lastName: "", email: "" };
    status = "idle";
    errorMessage = "";
  };
</script>

{#if status === "success"}
  <div class="newsletter__success">
    <div class="newsletter__success-icon" aria-hidden="true">
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
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="5"
        />
      </svg>
    </div>
    <h3 class="newsletter__success-title">Danke für dein Vertrauen!</h3>
    <p class="newsletter__success-message">
      Du erhältst ab jetzt Inspirationen, Termine und Neuigkeiten direkt in dein Postfach.
    </p>
    <div class="newsletter__success-steps">
      <div class="newsletter__success-step">
        <span class="newsletter__success-step-number">1</span>
        <p>Schau in dein E-Mail-Postfach und bestätige deine Anmeldung.</p>
      </div>
      <div class="newsletter__success-step">
        <span class="newsletter__success-step-number">2</span>
        <p>Trage die Adresse auf deine Safe-List ein, damit nichts verloren geht.</p>
      </div>
    </div>
    <button class="newsletter__success-back" type="button" on:click={resetForm}>
      Zurück zum Formular
      <svg
        fill="none"
        height="18"
        viewBox="0 0 24 24"
        width="18"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 19 5 12l7-7M5 12h14"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        />
      </svg>
    </button>
  </div>
{:else}
  <form
    class={className ?? "newsletter__form"}
    method="POST"
    use:enhance
    novalidate
  >
    <div class="newsletter__fields">
      <div class="newsletter__row">
        <div class="newsletter__field">
          <label class="sr-only" for="firstName">
            Vorname
          </label>
          <input
            autocomplete="given-name"
            class="newsletter__input"
            id="firstName"
            name="firstName"
            placeholder="Vorname"
            type="text"
            bind:value={$form.firstName}
            aria-invalid={$errors.firstName ? "true" : "false"}
          />
        </div>
        <div class="newsletter__field">
          <label class="sr-only" for="lastName">
            Nachname
          </label>
          <input
            autocomplete="family-name"
            class="newsletter__input"
            id="lastName"
            name="lastName"
            placeholder="Nachname"
            type="text"
            bind:value={$form.lastName}
            aria-invalid={$errors.lastName ? "true" : "false"}
          />
        </div>
      </div>
      <div class="newsletter__row">
        <div class="newsletter__field newsletter__field--email">
          <label class="sr-only" for="email">
            E-Mail
          </label>
          <input
            autocomplete="email"
            class="newsletter__input newsletter__input--email"
            id="email"
            name="email"
            inputmode="email"
            placeholder="deine@email.de"
            type="email"
            bind:value={$form.email}
            aria-invalid={$errors.email ? "true" : "false"}
          />
        </div>
        <button
          aria-label="Newsletter abonnieren"
          class="newsletter__submit"
          disabled={$delayed}
          type="submit"
        >
          <svg
            aria-hidden="true"
            class="newsletter__icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M5 12h14M12 5l7 7-7 7"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </svg>
        </button>
      </div>
    </div>

    {#if errorMessage}
      <div class="c-newsletter-form__error-container" aria-live="polite">
        <p class="c-newsletter-form__error-message">{errorMessage}</p>
      </div>
    {/if}

    <p class="newsletter__privacy">
      Mit der Anmeldung akzeptierst du unsere <a href={privacyHref}>Datenschutzbestimmungen</a>
    </p>
  </form>
{/if}
