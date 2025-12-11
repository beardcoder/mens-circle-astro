# Männerkreis Straubing - Projektstruktur

## Übersicht

Dieses Astro-Projekt folgt Best Practices für Wartbarkeit, Performance und Skalierbarkeit.

## Verzeichnisstruktur

```
src/
├── assets/              # Statische Assets (Bilder, etc.)
│   └── images/
├── components/          # Astro & React Komponenten
│   ├── layout/         # Layout-Komponenten (Header, Footer)
│   ├── *.astro         # Astro-Komponenten
│   └── *.tsx           # React-Komponenten
├── constants/          # App-weite Konstanten
│   └── site.ts         # Site-Metadaten und URLs
├── data/               # Content-Daten
│   ├── sections/       # Organisierte Daten nach Sektionen
│   │   ├── hero.ts
│   │   ├── features.ts
│   │   ├── about.ts
│   │   ├── journey.ts
│   │   ├── faq.ts
│   │   ├── event.ts
│   │   ├── quote.ts
│   │   └── newsletter.ts
│   ├── navigation.ts   # Navigationslinks
│   └── index.ts        # Zentraler Export aller Daten
├── layouts/            # Page Layouts
│   └── BaseLayout.astro
├── lib/                # Bibliotheks-Code
│   └── events.ts
├── pages/              # Routen (file-based routing)
│   ├── events/
│   │   └── [slug].astro
│   ├── index.astro
│   ├── impressum.astro
│   └── datenschutz.astro
├── styles/             # Globale Styles
│   ├── fonts/
│   └── global.css
├── types/              # TypeScript Typen & Schemas
│   ├── index.ts        # Type Definitionen
│   └── schemas.ts      # Zod Validierungs-Schemas
└── utils/              # Utility Funktionen
    └── date.ts         # Datums-Formatierung

public/                 # Statische öffentliche Dateien
├── favicon.svg
├── apple-touch-icon.png
└── site.webmanifest
```

## Wichtige Best Practices

### 1. **Modulare Datenstruktur**
- Daten sind nach Sektionen organisiert (`data/sections/`)
- Zentraler Export über `data/index.ts` für einfache Imports
- Runtime-Validierung mit Zod für Typ-Sicherheit

```typescript
// Statt:
import { heroContent } from '../data/siteContent';

// Jetzt:
import { heroContent } from '../data';
```

### 2. **Type Safety**
- Alle Typen zentralisiert in `src/types/`
- Zod-Schemas für Runtime-Validierung
- TypeScript strict mode aktiviert

### 3. **Performance-Optimierungen**

#### Hydration Strategy
- NavBar: `client:idle` (verzögerte Hydration)
- NewsletterForm: `client:visible` (nur bei Sichtbarkeit)
- Reduziert initiales JavaScript-Bundle

#### Image Optimization
- Astro Image Service konfiguriert
- Alt-Text für alle Bilder (Accessibility)
- Lazy Loading für below-the-fold Bilder
- WebP Format automatisch

#### Code Splitting
```javascript
// astro.config.mjs
vite: {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
        },
      },
    },
  },
}
```

### 4. **Accessibility (A11y)**
- Semantisches HTML
- ARIA-Labels wo nötig
- Beschreibende Alt-Texte für alle Bilder
- Schema.org Markup für FAQ

### 5. **Utility-First Approach**
- Wiederverwendbare Funktionen in `src/utils/`
- DRY (Don't Repeat Yourself) Prinzip
- Beispiel: `getDateParts()` statt duplizierter Datum-Logik

## Entwicklung

### Environment Variables
Kopiere `.env.example` zu `.env` und passe die Werte an:

```bash
cp .env.example .env
```

### Commands

```bash
# Development Server
npm run dev

# Production Build
npm run build

# Preview Production Build
npm run preview
```

## Content Management

### Neue Sektion hinzufügen

1. Erstelle Type in `src/types/index.ts`
2. Erstelle Zod-Schema in `src/types/schemas.ts`
3. Erstelle Daten-Datei in `src/data/sections/`
4. Exportiere in `src/data/index.ts`
5. Erstelle Komponente in `src/components/`

Beispiel:
```typescript
// 1. Type definieren
export type TestimonialContent = {
  author: string;
  text: string;
  rating: number;
};

// 2. Schema erstellen
export const testimonialSchema = z.object({
  author: z.string().min(1),
  text: z.string().min(10),
  rating: z.number().min(1).max(5),
});

// 3. Daten erstellen
// src/data/sections/testimonials.ts
import { testimonialSchema } from "../../types/schemas";

const rawTestimonials = [
  { author: "Max", text: "Super!", rating: 5 }
];

export const testimonials = z.array(testimonialSchema).parse(rawTestimonials);

// 4. Exportieren
// src/data/index.ts
export { testimonials } from "./sections/testimonials";
```

## Deployment

Das Projekt ist konfiguriert für statisches Hosting. Build-Output in `dist/` kann auf beliebigen Static-Hosts deployed werden:

- Netlify
- Vercel
- GitHub Pages
- Cloudflare Pages

## Migration Notes

### Von alter zu neuer Struktur

**Vorher:**
```typescript
import { heroContent, features, faqItems } from '../data/siteContent';
import type { HeroContent } from '../data/siteContent';
```

**Nachher:**
```typescript
import { heroContent, features, faqItems } from '../data';
import type { HeroContent } from '../types';
```

## Kontakt

Bei Fragen zur Projektstruktur: markus@mens-circle.de
