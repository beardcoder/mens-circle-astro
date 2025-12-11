# Quick Start Guide - PocketBase Integration

Schnellstart-Anleitung für die Entwicklung mit PocketBase.

## 🚀 In 5 Minuten starten

### 1. PocketBase installieren & starten

```bash
# Download PocketBase (macOS/Linux)
curl -LO https://github.com/pocketbase/pocketbase/releases/download/v0.22.0/pocketbase_0.22.0_darwin_amd64.zip
unzip pocketbase_0.22.0_darwin_amd64.zip
chmod +x pocketbase

# PocketBase starten
./pocketbase serve
```

**Output:**
```
Server started at http://127.0.0.1:8090
Admin UI: http://127.0.0.1:8090/_/
```

### 2. Admin-Account erstellen

1. Öffne: `http://127.0.0.1:8090/_/`
2. Erstelle Admin-Account (Email + Passwort)
3. Du bist jetzt im Admin-Dashboard

### 3. Collections erstellen

#### Collection A: `newsletter_subscribers`

1. **Collections** → **New collection** → **Base collection**
2. **Name:** `newsletter_subscribers`
3. **Felder hinzufügen:**
   - Klicke **+ New field**
   - **Type:** Email, **Name:** `email`, **Required:** ✓, **Unique:** ✓
   - **+ New field** → **Type:** Text, **Name:** `name`, **Max:** 200
4. **API Rules** → **Create rule:**
   - Klicke auf das 🔓 Icon bei "Create"
   - Setze: `@request.data.email != ""`
5. **Save changes**

#### Collection B: `events`

1. **Collections** → **New collection** → **Base collection**
2. **Name:** `events`
3. **Felder hinzufügen:**

   | Feldname             | Typ    | Required | Unique | Optionen                  |
   |----------------------|--------|----------|--------|---------------------------|
   | slug                 | Text   | ✓        | ✓      | Pattern: ^[a-z0-9-]+$     |
   | title                | Text   | ✓        |        | Max: 200                  |
   | description          | Editor | ✓        |        |                           |
   | date                 | Date   | ✓        |        |                           |
   | location             | Text   | ✓        |        | Max: 300                  |
   | time                 | Text   | ✓        |        |                           |
   | maxParticipants      | Number |          |        | Min: 1                    |
   | currentParticipants  | Number |          |        | Min: 0, Default: 0        |
   | status               | Select | ✓        |        | draft, published, cancelled, full |

4. **API Rules** → **List/View rule:**
   - Setze: `status = "published"`
5. **Save changes**

#### Collection C: `event_registrations`

1. **Collections** → **New collection** → **Base collection**
2. **Name:** `event_registrations`
3. **Felder hinzufügen:**

   | Feldname | Typ      | Required | Optionen                        |
   |----------|----------|----------|---------------------------------|
   | eventId  | Relation | ✓        | Collection: events, Single      |
   | name     | Text     | ✓        | Max: 200                        |
   | email    | Email    | ✓        |                                 |
   | phone    | Text     |          | Max: 50                         |
   | message  | Text     |          | Max: 500                        |
   | status   | Select   | ✓        | pending, confirmed, cancelled   |

4. **API Rules** → **Create rule:**
   - Setze: `@request.data.eventId != "" && @request.data.email != ""`
5. **Save changes**

### 4. Test-Event erstellen

1. **Collections** → **events** → **+ New record**
2. Fülle aus:
   ```
   slug: test-maennerkreis-2025
   title: Test Männerkreis
   description: Ein Test-Event für die Entwicklung
   date: 2025-12-21
   location: Raum & Zeit - Am Wirtsberg 6a
   time: 19:00 - 22:00
   status: published
   ```
3. **Create**

### 5. Astro starten

```bash
# Environment Variable setzen (oder .env erstellen)
echo "PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090" > .env

# Dependencies installieren (falls noch nicht geschehen)
npm install

# Development Server starten
npm run dev
```

Öffne: `http://localhost:4321`

---

## ✅ Testen

### Newsletter-Formular testen

1. Scrolle zum Newsletter-Bereich
2. Fülle Formular aus:
   - Vorname: Max
   - Nachname: Mustermann
   - Email: max@test.de
3. Abschicken
4. Überprüfe in PocketBase Admin: **Collections** → **newsletter_subscribers**

### Event-Anmeldung testen

1. Gehe zu: `http://localhost:4321/events/test-maennerkreis-2025`
2. Fülle Formular aus
3. Abschicken
4. Überprüfe in PocketBase Admin: **Collections** → **event_registrations**

---

## 🔧 Troubleshooting

### "Failed to fetch" Fehler

**Problem:** PocketBase läuft nicht

**Lösung:**
```bash
./pocketbase serve
```

### Port 8090 bereits in Benutzung

**Lösung:**
```bash
# Anderen Port verwenden
./pocketbase serve --http="127.0.0.1:8091"

# .env anpassen
PUBLIC_POCKETBASE_URL=http://127.0.0.1:8091
```

### Build schlägt fehl

**Problem:** PocketBase nicht erreichbar während Build

**Lösung:** Stelle sicher, dass PocketBase läuft während `npm run build`

Oder verwende `output: 'server'` in `astro.config.mjs` für SSR:

```javascript
export default defineConfig({
  output: 'server', // Statt 'static'
  // ...
});
```

---

## 📚 Nächste Schritte

- [ ] Weitere Events in PocketBase erstellen
- [ ] Email-Benachrichtigungen konfigurieren (PocketBase Business Logic)
- [ ] Production-Deployment vorbereiten (siehe [POCKETBASE_SETUP.md](./POCKETBASE_SETUP.md))
- [ ] Backup-Strategie implementieren

---

## 📖 Weiterführende Dokumentation

- **PocketBase Setup:** [POCKETBASE_SETUP.md](./POCKETBASE_SETUP.md)
- **Projekt-Struktur:** [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
- **PocketBase Docs:** https://pocketbase.io/docs/

---

## 💡 Tipps

### Collections exportieren/importieren

```bash
# Export (für Backup oder Migration)
# Admin UI → Settings → Export collections → JSON herunterladen

# Import
# Admin UI → Settings → Import collections → JSON hochladen
```

### PocketBase Daten zurücksetzen

```bash
# Stoppe PocketBase
# Lösche pb_data Ordner
rm -rf pb_data

# Starte neu
./pocketbase serve
```

### Real-time Updates (optional)

PocketBase unterstützt Real-time Subscriptions:

```typescript
import pb from './lib/pocketbase';

// Subscribe to event_registrations changes
pb.collection('event_registrations').subscribe('*', (e) => {
  console.log('New registration:', e.record);
});
```

---

Happy Coding! 🚀
