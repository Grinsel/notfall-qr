# Architektur – Notfall-QR

## Überblick

```
┌──────────────────────────────────────────────────────────────┐
│                        Internet                              │
│                           │                                  │
│                    ┌──────▼──────┐                            │
│                    │   Nginx     │  HTTPS, Rate Limiting,     │
│                    │   Reverse   │  Security Headers          │
│                    │   Proxy     │                            │
│                    └──────┬──────┘                            │
│                           │ :3000                            │
│                    ┌──────▼──────┐                            │
│                    │  Next.js    │  App Router, API Routes,   │
│                    │  App        │  Server Components,        │
│                    │             │  Client Components         │
│                    └──────┬──────┘                            │
│                           │                                  │
│              ┌────────────┼────────────┐                     │
│              │            │            │                      │
│       ┌──────▼──────┐ ┌───▼───┐ ┌──────▼──────┐             │
│       │  Prisma ORM │ │ Crypto│ │ Rate Limit  │             │
│       │             │ │ Layer │ │ (In-Memory) │             │
│       └──────┬──────┘ └───────┘ └─────────────┘             │
│              │                                               │
│       ┌──────▼──────┐                                        │
│       │ PostgreSQL  │  Verschlüsselte Daten,                 │
│       │ (SQLite Dev)│  Zugriffslogs                          │
│       └─────────────┘                                        │
└──────────────────────────────────────────────────────────────┘
```

## Stack-Begründung

| Entscheidung | Begründung |
|---|---|
| **Next.js 15** | Full-Stack in einem Framework. App Router für moderne React-Patterns. API Routes eliminieren separaten Backend-Server. |
| **TypeScript** | Typsicherheit für Kryptografie-Code und API-Schnittstellen. Weniger Laufzeitfehler. |
| **Tailwind CSS 4** | Rapid UI-Entwicklung, konsistentes Design, gute Druckstil-Unterstützung. |
| **Prisma** | Type-safe Database-Zugriff, automatische Migrationen, einfacher Wechsel SQLite→PostgreSQL. |
| **SQLite (Dev) / PostgreSQL (Prod)** | SQLite für zero-config Entwicklung. PostgreSQL für Produktion (Concurrency, Backups). |
| **qrcode (clientseitig)** | Keine Server-Last für QR-Generierung, funktioniert offline nach initialem Laden. |
| **jsPDF** | Client-seitiger PDF-Export ohne Server-Abhängigkeit. |
| **Docker** | Reproduzierbare Deployments, einfache Skalierung. |

## Datenmodell

```
EmergencyRecord
├── id (CUID)
├── title (Klartext – öffentlich sichtbar)
├── encryptedData (AES-256-GCM JSON)
├── encryptionIv
├── encryptionTag
├── accessToken (URL-safe, 32 Bytes)    → QR-Code-Link
├── editToken (URL-safe, 32 Bytes)      → Bearbeitungslink
├── pinHash (optional)
├── isActive (Boolean)
├── email (optional)
├── createdAt / updatedAt
└── accessLogs[] → AccessLog

AccessLog
├── id
├── recordId → EmergencyRecord
├── action (view / view_details / pin_attempt / edit)
├── ipHash (SHA-256, gekürzt)
├── userAgent (gekürzt)
└── createdAt
```

### Verschlüsselte Felder (in `encryptedData`):

```json
{
  "accessInfo": "Schlüssel beim Nachbarn...",
  "gasShutoff": "Keller rechts...",
  "electricPanel": "Flur...",
  "waterShutoff": "Keller...",
  "additionalNotes": "...",
  "contactPerson": "...",
  "pets": "..."
}
```

## Sicherheitsarchitektur

### Token-Design

- **accessToken**: 32 Bytes (256 Bit), URL-safe Base64 → ca. 43 Zeichen
  - Entropy: 2^256 mögliche Werte → nicht erratbar
  - Wird im QR-Code als Teil der URL verwendet
  - Berechtigt zum Lesen (ggf. nach PIN-Eingabe)

- **editToken**: 32 Bytes, URL-safe Base64
  - Separates Token für Bearbeitungszugriff
  - Berechtigt zu CRUD-Operationen
  - Wird NIE im QR-Code verwendet

### Verschlüsselung

```
Klartext-JSON → AES-256-GCM (ENCRYPTION_KEY, Random IV) → encryptedData + IV + AuthTag
```

- **Algorithmus**: AES-256-GCM (authentifizierte Verschlüsselung)
- **Schlüssel**: 256-Bit aus Umgebungsvariable
- **IV**: 96-Bit, kryptographisch zufällig, pro Datensatz einzigartig
- **Auth-Tag**: 128-Bit, Integritätsschutz

### Datenfluss

```
Erstellen:
  Nutzer → Formular → API POST /api/records
    → Validation (Zod)
    → Encrypt(sensitiveFields)
    → Generate accessToken + editToken
    → Hash PIN (optional)
    → DB Insert
    → Response: { accessToken, editToken }

Abrufen (QR-Scan):
  Einsatzkraft → QR-Scan → GET /api/view/{accessToken}
    → Rate Limit Check
    → DB Lookup (accessToken)
    → Active Check
    → Log Access
    → PIN required?
      → Ja: Return { title, requiresPin: true }
      → Nein: Decrypt → Return all fields

PIN-Verifizierung:
  POST /api/view/{accessToken}/verify-pin
    → Stricter Rate Limit
    → Verify PIN (timing-safe)
    → Log attempt
    → Success: Decrypt → Return all fields
```

## Verzeichnisstruktur

```
notfall-qr/
├── prisma/
│   └── schema.prisma          # Datenbankschema
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── records/       # CRUD API
│   │   │   │   ├── route.ts          # POST (erstellen)
│   │   │   │   └── [editToken]/
│   │   │   │       └── route.ts      # GET/PUT/DELETE/PATCH
│   │   │   └── view/
│   │   │       └── [token]/
│   │   │           ├── route.ts      # GET (abrufen)
│   │   │           └── verify-pin/
│   │   │               └── route.ts  # POST (PIN prüfen)
│   │   ├── erstellen/         # Erfassungsformular
│   │   ├── verwalten/[editToken]/  # Bearbeitungsseite
│   │   ├── qr/[editToken]/    # QR-Anzeige + Export
│   │   ├── notfall/[token]/   # Abrufseite (Einsatzkräfte)
│   │   ├── datenschutz/       # Datenschutzhinweise
│   │   ├── impressum/         # Impressum
│   │   ├── nutzungsbedingungen/ # AGB
│   │   ├── layout.tsx         # Root Layout
│   │   ├── globals.css        # Global Styles
│   │   └── page.tsx           # Landing Page
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── EmergencyForm.tsx
│   ├── lib/
│   │   ├── prisma.ts          # Prisma Client Singleton
│   │   ├── crypto.ts          # AES-256-GCM, Token-Gen, PIN-Hash
│   │   ├── rate-limit.ts      # In-Memory Rate Limiter
│   │   ├── validation.ts      # Zod Schemas
│   │   └── utils.ts           # Hilfsfunktionen
│   └── types/                 # TypeScript Types
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── .env.example
├── README.md
├── DEPLOYMENT.md
├── ARCHITECTURE.md
├── SECURITY.md
└── PRIVACY.md
```

## Nächste Ausbaustufen

1. **Magic-Link per E-Mail** – E-Mail-Versand für Bearbeitungslink-Wiederherstellung
2. **Aufkleber-Bestellfunktion** – Integration mit Druckdienstleister
3. **Admin-Dashboard** – Übersicht, Missbrauchserkennung, Statistiken
4. **Redis Rate Limiting** – Skalierbar über mehrere Instanzen
5. **Einsatzkräfte-Verifizierung** – Optional: Zugriff nur für verifizierte Nutzer
6. **Mehrsprachigkeit** – i18n für nicht-deutschsprachige Nutzer
7. **Progressive Web App** – Offline-Zugriff auf bereits geladene Datensätze
8. **Selbst-gehostete Variante** – One-Click-Deploy mit SQLite, ohne Docker
