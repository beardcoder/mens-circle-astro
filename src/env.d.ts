/// <reference types="astro/client" />
/// <reference types="@types/alpinejs" />

interface ImportMetaEnv {
  readonly PUBLIC_POCKETBASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Alpine.js global
interface Window {
  Alpine: any;
}
