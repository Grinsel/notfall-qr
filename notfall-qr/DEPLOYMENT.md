# Deployment-Anleitung – Notfall-QR

## Voraussetzungen

- Linux-Server (Ubuntu 22.04+ empfohlen) oder vergleichbar
- Docker 24+ und Docker Compose v2
- Eigene Domain mit DNS-Eintrag auf den Server
- Mindestens 1 GB RAM, 10 GB Speicher
- SSH-Zugang zum Server

## Architekturüberblick

```
Internet → Nginx (HTTPS/TLS) → Next.js App (:3000) → PostgreSQL (:5432)
                                     ↓
                              Prisma ORM + AES-256-GCM Verschlüsselung
```

## Schritt-für-Schritt Deployment

### 1. Server vorbereiten

```bash
# System aktualisieren
sudo apt update && sudo apt upgrade -y

# Docker installieren (falls nicht vorhanden)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Nginx installieren
sudo apt install -y nginx certbot python3-certbot-nginx

# Firewall konfigurieren
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22
sudo ufw enable
```

### 2. Anwendung deployen

```bash
# Projekt klonen
cd /opt
sudo git clone <repo-url> notfall-qr
cd notfall-qr
sudo chown -R $USER:$USER .

# Umgebungsvariablen konfigurieren
cp .env.example .env
nano .env
```

### 3. Umgebungsvariablen (WICHTIG!)

Folgende Werte MÜSSEN für Produktion angepasst werden:

```bash
# Sichere Schlüssel generieren:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# → Ausgabe als ENCRYPTION_KEY verwenden

node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# → Ausgabe als MAGIC_LINK_SECRET verwenden

# Sicheres DB-Passwort generieren:
openssl rand -base64 32
# → Als DB_PASSWORD verwenden
```

**.env Produktionswerte:**

| Variable | Beschreibung | Beispiel |
|---|---|---|
| `DATABASE_URL` | PostgreSQL-Verbindung | Wird von docker-compose gesetzt |
| `NEXT_PUBLIC_BASE_URL` | Öffentliche URL | `https://notfall-qr.ihredomain.de` |
| `ENCRYPTION_KEY` | 64-stelliger Hex-String | `a1b2c3...` (generieren!) |
| `MAGIC_LINK_SECRET` | 128-stelliger Hex-String | `d4e5f6...` (generieren!) |
| `DB_PASSWORD` | Datenbank-Passwort | `...` (generieren!) |
| `RATE_LIMIT_MAX_REQUESTS` | Max. Requests/Minute/IP | `10` |
| `RATE_LIMIT_WINDOW_SECONDS` | Zeitfenster | `60` |

### 4. Docker Compose starten

```bash
# Bauen und starten
docker compose up -d --build

# Logs prüfen
docker compose logs -f app

# Status prüfen
docker compose ps
```

### 5. Nginx und HTTPS einrichten

```bash
# Nginx-Konfiguration kopieren
sudo cp nginx.conf /etc/nginx/sites-available/notfall-qr

# Domain anpassen!
sudo nano /etc/nginx/sites-available/notfall-qr

# Aktivieren
sudo ln -s /etc/nginx/sites-available/notfall-qr /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# SSL-Zertifikat mit Certbot (VORHER die server_name-Zeilen und ssl-Zeilen anpassen):
# Temporär die SSL-Zeilen auskommentieren, nur Port 80 konfigurieren
sudo certbot --nginx -d notfall-qr.ihredomain.de

# Nginx neu laden
sudo nginx -t && sudo systemctl reload nginx
```

### 6. Funktionstest

```bash
# Anwendung erreichbar?
curl -I https://notfall-qr.ihredomain.de

# Datenbank-Verbindung?
docker compose exec app npx prisma db seed --preview-feature || true
```

## Backups

### Automatisches Backup (in docker-compose.yml integriert)

Der `backup`-Service erstellt täglich ein SQL-Dump in `./backups/` und löscht Backups älter als 30 Tage.

### Manuelles Backup

```bash
# Datenbank-Dump
docker compose exec db pg_dump -U notfallqr notfallqr > backup_$(date +%Y%m%d).sql

# Verschlüsselungsschlüssel sichern! (KRITISCH)
# Ohne den ENCRYPTION_KEY sind die Daten nicht wiederherstellbar!
cp .env /path/to/secure/backup/.env.backup
```

### Restore

```bash
# Datenbank wiederherstellen
docker compose exec -T db psql -U notfallqr notfallqr < backup_20240101.sql

# WICHTIG: .env mit dem GLEICHEN ENCRYPTION_KEY wiederherstellen!
```

## Updates

```bash
cd /opt/notfall-qr

# Code aktualisieren
git pull

# Neu bauen und starten
docker compose up -d --build

# Migrationen werden beim Start automatisch ausgeführt
```

## Logs und Monitoring

```bash
# Application Logs
docker compose logs -f app

# Datenbank-Logs
docker compose logs -f db

# Nginx Access-Log
sudo tail -f /var/log/nginx/notfall-qr-access.log

# Nginx Error-Log
sudo tail -f /var/log/nginx/notfall-qr-error.log

# Ressourcen-Verbrauch
docker stats
```

### Basis-Monitoring

Empfehlung für einfaches Monitoring:

```bash
# Uptime-Check mit curl (als Cronjob)
*/5 * * * * curl -sf https://notfall-qr.ihredomain.de > /dev/null || echo "Notfall-QR DOWN" | mail -s "Alert" admin@example.com

# Oder: UptimeRobot (kostenlos) / Uptime Kuma (self-hosted)
```

## Skalierung

### Vertikale Skalierung
- Mehr RAM/CPU für den Server
- PostgreSQL-Tuning (shared_buffers, work_mem)

### Horizontale Skalierung (bei Bedarf)
- Redis für Rate Limiting und Session-Cache
- Mehrere App-Instanzen hinter Load Balancer
- PostgreSQL Read-Replicas

### Für das erwartete Nutzungsvolumen (Privatanwender):
Ein einzelner VPS mit 2 GB RAM reicht für tausende Datensätze und hunderte gleichzeitige Zugriffe.

## Kostenbewusste Hosting-Optionen

| Anbieter | Typ | Kosten/Monat | Hinweis |
|---|---|---|---|
| Hetzner Cloud CX22 | VPS | ~4 € | 2 vCPU, 4 GB RAM, empfohlen |
| Hetzner Cloud CX11 | VPS | ~4 € | 1 vCPU, 2 GB RAM, Minimum |
| Netcup VPS 500 | VPS | ~4 € | Alternative |
| DigitalOcean Basic | VPS | ~6 $ | Alternative |

### Serverless/Static Hosting?

**Nicht direkt geeignet**, da die Anwendung:
- Eine Datenbank benötigt (PostgreSQL/SQLite)
- Server-seitige Verschlüsselung durchführt
- Rate Limiting am Server implementiert

**Teilweise möglich** mit:
- Vercel (Next.js nativ) + Neon/Supabase (PostgreSQL) – aber: Verschlüsselungsschlüssel als Environment Variable bei Drittanbieter
- Railway/Render – ähnlich, einfaches Deployment, aber Drittanbieter-Hosting der Schlüssel

**Empfehlung**: Eigener VPS für volle Kontrolle über Verschlüsselungsschlüssel und Daten.

## Sicherheitsrelevante Konfigurationshinweise

- [ ] ENCRYPTION_KEY sicher generiert und gesichert
- [ ] DB_PASSWORD sicher generiert
- [ ] MAGIC_LINK_SECRET sicher generiert
- [ ] Firewall konfiguriert (nur 22, 80, 443)
- [ ] PostgreSQL nicht von außen erreichbar
- [ ] HTTPS mit gültigem Zertifikat
- [ ] Security Headers in Nginx gesetzt
- [ ] Regelmäßige OS-Updates konfiguriert
- [ ] Backup-Strategie implementiert
- [ ] ENCRYPTION_KEY extern gesichert
- [ ] Logs werden überwacht
