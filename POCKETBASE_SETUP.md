# PocketBase Setup Guide

Dieses Projekt verwendet PocketBase als Backend für Formulare und Events.

## Inhaltsverzeichnis

1. [Installation](#installation)
2. [Collections Setup](#collections-setup)
3. [Development](#development)
4. [Production Deployment](#production-deployment)
5. [API Endpoints](#api-endpoints)

---

## Installation

### 1. PocketBase herunterladen

```bash
# Für macOS/Linux
curl -LO https://github.com/pocketbase/pocketbase/releases/download/v0.22.0/pocketbase_0.22.0_darwin_amd64.zip
unzip pocketbase_0.22.0_darwin_amd64.zip
chmod +x pocketbase

# Oder besuche: https://pocketbase.io/docs/
```

### 2. PocketBase starten

```bash
# Im Projekt-Verzeichnis
./pocketbase serve
```

PocketBase läuft nun auf: `http://127.0.0.1:8090`

### 3. Admin-Account erstellen

1. Öffne `http://127.0.0.1:8090/_/`
2. Erstelle einen Admin-Account
3. Du wirst zum Admin-Dashboard weitergeleitet

---

## Collections Setup

### Collection 1: `newsletter_subscribers`

Speichert Newsletter-Anmeldungen.

**Felder:**

| Feldname | Typ    | Required | Unique | Optionen                    |
|----------|--------|----------|--------|-----------------------------|
| email    | Email  | ✓        | ✓      | -                           |
| name     | Text   | ✗        | ✗      | Max: 200                    |

**API Rules:**

- **List/View:** `@request.auth.id != ""`  (nur für Admins)
- **Create:** `@request.data.email != ""`  (öffentlich)
- **Update:** `@request.auth.id != ""`  (nur für Admins)
- **Delete:** `@request.auth.id != ""`  (nur für Admins)

**Validation:**

```javascript
// Validation für Create/Update
// In PocketBase Admin: Collections > newsletter_subscribers > API Rules
// Custom validation rule (optional):
$fields.email ~ "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
```

---

### Collection 2: `events`

Speichert alle Events/Veranstaltungen.

**Felder:**

| Feldname           | Typ      | Required | Unique | Optionen                           |
|--------------------|----------|----------|--------|------------------------------------|
| slug               | Text     | ✓        | ✓      | Pattern: ^[a-z0-9-]+$              |
| title              | Text     | ✓        | ✗      | Max: 200                           |
| description        | Editor   | ✓        | ✗      | -                                  |
| date               | Date     | ✓        | ✗      | -                                  |
| location           | Text     | ✓        | ✗      | Max: 300                           |
| time               | Text     | ✓        | ✗      | e.g., "19:00 - 22:00"              |
| maxParticipants    | Number   | ✗        | ✗      | Min: 1                             |
| currentParticipants| Number   | ✗        | ✗      | Min: 0, Default: 0                 |
| status             | Select   | ✓        | ✗      | draft, published, cancelled, full  |

**API Rules:**

- **List/View:** `status = "published"`  (öffentlich für publizierte Events)
- **Create:** `@request.auth.id != ""`  (nur für Admins)
- **Update:** `@request.auth.id != ""`  (nur für Admins)
- **Delete:** `@request.auth.id != ""`  (nur für Admins)

**Indexes:**

- `slug` (unique)
- `date` (für Performance bei Sortierung)
- `status` (für Filterung)

---

### Collection 3: `event_registrations`

Speichert Event-Anmeldungen.

**Felder:**

| Feldname | Typ      | Required | Unique | Optionen                              |
|----------|----------|----------|--------|---------------------------------------|
| eventId  | Relation | ✓        | ✗      | → events collection                   |
| name     | Text     | ✓        | ✗      | Max: 200                              |
| email    | Email    | ✓        | ✗      | -                                     |
| phone    | Text     | ✗        | ✗      | Max: 50                               |
| message  | Text     | ✗        | ✗      | Max: 500                              |
| status   | Select   | ✓        | ✗      | pending, confirmed, cancelled         |

**API Rules:**

- **List/View:** `@request.auth.id != ""`  (nur für Admins)
- **Create:** `@request.data.eventId != "" && @request.data.email != ""`  (öffentlich)
- **Update:** `@request.auth.id != ""`  (nur für Admins)
- **Delete:** `@request.auth.id != ""`  (nur für Admins)

**Indexes:**

- `eventId` (für Performance)
- `email` + `eventId` (composite, um Duplikate zu verhindern)

**Hooks/Automationen (optional):**

Du kannst in PocketBase Business Logic via JavaScript Hooks hinzufügen:

```javascript
// Example: Auto-increment currentParticipants when registration is created
onRecordAfterCreateRequest((e) => {
  const eventId = e.record.get("eventId");
  const event = $app.dao().findRecordById("events", eventId);

  event.set("currentParticipants", event.get("currentParticipants") + 1);
  $app.dao().saveRecord(event);
}, "event_registrations");
```

---

## Development

### 1. Environment Variables

Kopiere `.env.example` zu `.env`:

```bash
cp .env.example .env
```

Stelle sicher, dass folgende Variable gesetzt ist:

```env
PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
```

### 2. PocketBase starten

```bash
./pocketbase serve
```

### 3. Astro Development Server

```bash
npm run dev
```

### 4. Test-Event erstellen

1. Gehe zu `http://127.0.0.1:8090/_/`
2. Login als Admin
3. Navigiere zu `Collections > events > New record`
4. Erstelle ein Test-Event:
   - **slug:** `test-event-2025`
   - **title:** `Test Männerkreis`
   - **description:** `Beschreibung...`
   - **date:** `2025-12-21`
   - **location:** `Raum & Zeit - Am Wirtsberg 6a`
   - **time:** `19:00 - 22:00`
   - **status:** `published`

---

## Production Deployment

### Option 1: PocketHost (Empfohlen)

[PocketHost](https://pockethost.io/) ist ein managed PocketBase Hosting Service.

1. Erstelle Account auf pockethost.io
2. Erstelle neue PocketBase-Instanz
3. Importiere deine Collections (via JSON Export/Import)
4. Setze `PUBLIC_POCKETBASE_URL` auf deine PocketHost URL

### Option 2: Self-Hosted (VPS/Server)

```bash
# Auf deinem Server
wget https://github.com/pocketbase/pocketbase/releases/download/v0.22.0/pocketbase_0.22.0_linux_amd64.zip
unzip pocketbase_0.22.0_linux_amd64.zip
chmod +x pocketbase

# Als systemd service
sudo nano /etc/systemd/system/pocketbase.service
```

**pocketbase.service:**

```ini
[Unit]
Description=PocketBase
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/pocketbase
ExecStart=/var/www/pocketbase/pocketbase serve --http="0.0.0.0:8090"
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable pocketbase
sudo systemctl start pocketbase
```

### Option 3: Docker

```dockerfile
FROM alpine:latest

ARG PB_VERSION=0.22.0

RUN apk add --no-cache \
    unzip \
    ca-certificates

ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

EXPOSE 8090

CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090"]
```

---

## API Endpoints

### Newsletter

**Subscribe:**

```typescript
import { subscribeToNewsletter } from './lib/api/newsletter';

await subscribeToNewsletter({
  email: "test@example.com",
  name: "Max Mustermann"
});
```

### Events

**Get upcoming events:**

```typescript
import { getUpcomingEvents } from './lib/api/events';

const events = await getUpcomingEvents();
```

**Get event by slug:**

```typescript
import { getEventBySlug } from './lib/api/events';

const event = await getEventBySlug('test-event-2025');
```

**Register for event:**

```typescript
import { registerForEvent } from './lib/api/events';

await registerForEvent({
  eventId: "abc123",
  name: "Max Mustermann",
  email: "max@example.com",
  phone: "+49 123 456789",
  message: "Freue mich drauf!",
  status: "pending"
});
```

---

## Backup & Migration

### Export Collections

```bash
# Via Admin UI
http://127.0.0.1:8090/_/ → Settings → Export collections

# Via CLI (coming soon in PocketBase)
```

### Import Collections

Nutze die Admin UI: Settings → Import collections

---

## Troubleshooting

### PocketBase läuft nicht auf Port 8090

```bash
# Check if port is in use
lsof -i :8090

# Use different port
./pocketbase serve --http="127.0.0.1:8091"
```

Dann `.env` anpassen:

```env
PUBLIC_POCKETBASE_URL=http://127.0.0.1:8091
```

### CORS Errors

PocketBase erlaubt standardmäßig alle Origins in Development. Für Production:

1. Admin UI → Settings → Application
2. Setze `Allowed origins` auf deine Domain

### Build schlägt fehl: "Cannot connect to PocketBase"

Während `astro build`:

- Stelle sicher, dass PocketBase läuft
- Oder: Erstelle Fallback-Daten für Build-Zeit

```typescript
// src/lib/api/events.ts
export async function getPublishedEvents(): Promise<Event[]> {
  try {
    const records = await pb.collection(Collections.EVENTS).getFullList({
      filter: 'status = "published"',
      sort: "+date",
    });
    return records as Event[];
  } catch (error) {
    console.error("Error fetching events:", error);
    // Fallback für Build-Zeit
    return [];
  }
}
```

---

## Weitere Resources

- [PocketBase Docs](https://pocketbase.io/docs/)
- [PocketBase JS SDK](https://github.com/pocketbase/js-sdk)
- [Community Discord](https://discord.gg/pocketbase)
