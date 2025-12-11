<script lang="ts">
  import { superForm } from "sveltekit-superforms";
  import { zod } from "sveltekit-superforms/adapters";
  import { eventRegistrationSchema } from "@app-types/pocketbase-schemas";
  import { registerForEvent } from "@lib/api/events";

  export let eventId: string;
  export let eventTitle: string;
  export let privacyHref: string = "/datenschutz";
  export let className: string | undefined = undefined;

  const formSchema = eventRegistrationSchema.omit({ status: true });

  let status: "idle" | "success" | "error" = "idle";
  let errorMessage = "";

  const { form, errors, enhance, delayed } = superForm(
    { eventId, name: "", email: "", phone: "", message: "" },
    {
      validators: zod(formSchema),
      SPA: true,
      async onUpdate({ form }) {
        if (!form.valid) {
          status = "error";
          errorMessage = "";
          return;
        }

        try {
          await registerForEvent({
            ...form.data,
            status: "pending",
          });
          status = "success";
        } catch (error: any) {
          status = "error";
          errorMessage =
            error?.message || "Anmeldung fehlgeschlagen. Bitte versuche es später erneut.";
        }
      },
    }
  );

  // Keep eventId in sync
  $: if (eventId && $form.eventId !== eventId) {
    $form.eventId = eventId;
  }

  const resetForm = () => {
    $form = { eventId, name: "", email: "", phone: "", message: "" };
    status = "idle";
    errorMessage = "";
  };
</script>

{#if status === "success"}
  <div class="event-registration__success">
    <div class="event-registration__success-icon" aria-hidden="true">
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
    <h3 class="event-registration__success-title">Anmeldung erfolgreich!</h3>
    <p class="event-registration__success-message">
      Deine Anmeldung für <strong>{eventTitle}</strong> wurde erfolgreich übermittelt. Du erhältst
      in Kürze eine Bestätigung per E-Mail.
    </p>
    <button class="event-registration__success-back" type="button" on:click={resetForm}>
      Weitere Anmeldung
    </button>
  </div>
{:else}
  <form
    class={className ?? "event-registration__form"}
    method="POST"
    use:enhance
    novalidate
  >
    <div class="event-registration__fields">
      <div class="event-registration__field">
        <label for="name">
          Name <span aria-label="Pflichtfeld">*</span>
        </label>
        <input
          autocomplete="name"
          class="event-registration__input"
          id="name"
          name="name"
          placeholder="Dein vollständiger Name"
          type="text"
          bind:value={$form.name}
          aria-invalid={$errors.name ? "true" : "false"}
        />
        {#if $errors.name}
          <p class="event-registration__error">{$errors.name}</p>
        {/if}
      </div>

      <div class="event-registration__field">
        <label for="email">
          E-Mail <span aria-label="Pflichtfeld">*</span>
        </label>
        <input
          autocomplete="email"
          class="event-registration__input"
          id="email"
          name="email"
          inputmode="email"
          placeholder="deine@email.de"
          type="email"
          bind:value={$form.email}
          aria-invalid={$errors.email ? "true" : "false"}
        />
        {#if $errors.email}
          <p class="event-registration__error">{$errors.email}</p>
        {/if}
      </div>

      <div class="event-registration__field">
        <label for="phone">
          Telefon <span class="event-registration__optional">(optional)</span>
        </label>
        <input
          autocomplete="tel"
          class="event-registration__input"
          id="phone"
          name="phone"
          inputmode="tel"
          placeholder="+49 123 456789"
          type="tel"
          bind:value={$form.phone}
          aria-invalid={$errors.phone ? "true" : "false"}
        />
        {#if $errors.phone}
          <p class="event-registration__error">{$errors.phone}</p>
        {/if}
      </div>

      <div class="event-registration__field">
        <label for="message">
          Nachricht <span class="event-registration__optional">(optional)</span>
        </label>
        <textarea
          class="event-registration__textarea"
          id="message"
          name="message"
          placeholder="Hast du Fragen oder Anmerkungen?"
          rows="4"
          bind:value={$form.message}
          aria-invalid={$errors.message ? "true" : "false"}
        ></textarea>
        {#if $errors.message}
          <p class="event-registration__error">{$errors.message}</p>
        {/if}
      </div>
    </div>

    {#if errorMessage}
      <div class="event-registration__error-container" aria-live="polite">
        <p class="event-registration__error-message">{errorMessage}</p>
      </div>
    {/if}

    <p class="event-registration__privacy">
      Mit der Anmeldung akzeptierst du unsere <a href={privacyHref}>Datenschutzbestimmungen</a>
    </p>

    <button class="event-registration__submit" disabled={$delayed} type="submit">
      {$delayed ? "Wird gesendet..." : "Jetzt anmelden"}
    </button>
  </form>
{/if}
