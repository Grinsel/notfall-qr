# Notfall-QR

**Notfallinformationen für Einsatzkräfte – sicher hinterlegt, schnell abrufbar.**

Notfall-QR ermöglicht Bürgern, wichtige Informationen zu ihrer Wohnung digital zu hinterlegen und einen QR-Code zu erzeugen. Dieser kann an der Haustür angebracht werden, damit Einsatzkräfte im Ernstfall schneller relevante Informationen finden.

## Features

- **Notfalldatensatz erstellen** – Schlüsselstandort, Gas-/Wasser-/Strom-Absperrhähne, Haustiere, Kontaktpersonen
- **Sicherer QR-Code** – enthält nur eine URL mit kryptographischem Token, keine Klartextdaten
- **Verschlüsselte Speicherung** – AES-256-GCM für alle sensiblen Daten
- **Optionaler PIN-Schutz** – Zweistufig: Titel öffentlich, Details hinter PIN
- **PDF-/Bild-Export** – QR-Code als PNG, PDF oder direkt drucken
- **Jederzeit verwaltbar** – Bearbeiten, Deaktivieren, Löschen über Bearbeitungslink
- **Rate Limiting** – Schutz gegen Massenscans und Token-Enumeration
- **Mobile-first Notfallansicht** – Große, klare Darstellung für Einsatzkräfte
- **DSGVO-orientiert** – Datensparsamkeit, keine Cookies, kein Tracking

## Tech Stack

| Komponente | Technologie |
|---|---|
| Frontend & Backend | Next.js 15 (App Router) |
| Sprache | TypeScript |
| Styling | Tailwind CSS 4 |
| Datenbank | SQLite (Dev) / PostgreSQL (Prod) |
| ORM | Prisma |
| QR-Generierung | qrcode (clientseitig) |
| PDF-Export | jsPDF |
| Container | Docker + Docker Compose |
| Reverse Proxy | Nginx |

## Schnellstart (Entwicklung)

```bash
# Repository klonen
git clone <repo-url>
cd notfall-qr

# Dependencies installieren
npm install

# Umgebungsvariablen
cp .env.example .env
# .env anpassen (für Entwicklung sind die Defaults OK)

# Datenbank initialisieren
npx prisma migrate dev

# Entwicklungsserver starten
npm run dev
```

Anwendung öffnen: [http://localhost:3000](http://localhost:3000)

## Produktion

Siehe [DEPLOYMENT.md](./DEPLOYMENT.md) für die vollständige Deployment-Anleitung.

```bash
# Kurzversion mit Docker Compose:
cp .env.example .env
# .env mit sicheren Werten füllen!
docker compose up -d
```

## Dokumentation

| Dokument | Beschreibung |
|---|---|
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Deployment- und Hosting-Anleitung |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Architekturübersicht |
| [SECURITY.md](./SECURITY.md) | Sicherheitskonzept |
| [PRIVACY.md](./PRIVACY.md) | Datenschutzkonzept |

## Sicherheitshinweise

- **Kein offizieller Dienst** – Steht in keiner Verbindung zu Behörden oder Rettungsdiensten
- **Keine Nutzungsgarantie** – Kein Anspruch, dass Einsatzkräfte den QR-Code scannen
- **Eigenverantwortung** – Nutzer entscheiden selbst über eingegebene Informationen
- **Sichtbarkeitsrisiko** – Jeder kann einen sichtbar angebrachten QR-Code scannen

## Lizenz

[MIT](./LICENSE) – oder nach Wahl des Betreibers.
