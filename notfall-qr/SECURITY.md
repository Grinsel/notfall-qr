# Sicherheitskonzept – Notfall-QR

## Getroffene Sicherheitsentscheidungen

### 1. QR-Code enthält keine Daten

**Entscheidung:** Der QR-Code enthält ausschließlich eine URL mit kryptographischem Token.

**Begründung:** Klartextdaten im QR-Code wären unwiderruflich – einmal gedruckt, kann der Inhalt nicht geändert oder deaktiviert werden. Das URL-basierte Konzept ermöglicht:
- Deaktivierung/Löschung jederzeit
- Datenänderung ohne neuen QR-Code
- Rate Limiting und Zugriffsprotokollierung
- Optionalen PIN-Schutz

### 2. Token-Design (256 Bit)

**Entscheidung:** 32-Byte kryptographisch zufällige Tokens (URL-safe Base64).

**Begründung:**
- 2^256 mögliche Werte → Erraten praktisch unmöglich
- Kein sequentielles Schema → keine Enumeration möglich
- Separate Tokens für Lese- und Schreibzugriff

### 3. AES-256-GCM Verschlüsselung

**Entscheidung:** Sensible Daten werden auf Anwendungsebene verschlüsselt.

**Begründung:**
- Schutz bei Datenbank-Kompromittierung
- Authentifizierte Verschlüsselung (GCM) schützt vor Manipulation
- Zufälliger IV pro Datensatz verhindert Pattern-Analyse

**Grenzen:**
- Schlüssel liegt als Umgebungsvariable vor → Server-Kompromittierung = Datenzugriff
- Kein Client-seitiges E2E-Encryption (würde PIN-freien Zugriff verhindern)

### 4. Zweistufiges Zugriffsmodell

**Entscheidung:** Titel öffentlich, Details optional hinter PIN.

**Begründung:**
- Im Notfall muss schneller Zugriff möglich sein → PIN kann Hindernis sein
- Nutzer können selbst entscheiden: Ohne PIN = maximale Notfall-Tauglichkeit, Mit PIN = mehr Schutz
- Titel (z.B. "Wohnung 2. OG links") ist keine sensible Information

### 5. Rate Limiting

**Entscheidung:** In-Memory Rate Limiter, 10 Requests/Minute/IP.

**Begründung:**
- Schutz gegen Token-Brute-Force (bei 2^256 Entropy ohnehin sinnlos, aber Defense-in-Depth)
- Schutz gegen Massenscans (z.B. kompromittierte QR-Code-Scanner-App)
- Strengeres Limit für PIN-Versuche

**Grenzen:**
- In-Memory = nicht persistent über Neustarts
- Nicht skalierbar über mehrere Instanzen → Redis für Produktion empfohlen

### 6. IP-Hashing in Logs

**Entscheidung:** IP-Adressen werden gehasht und gekürzt gespeichert (SHA-256, 16 Zeichen).

**Begründung:**
- DSGVO: IP-Adressen sind personenbezogene Daten
- Gehashte IP ermöglicht Pattern-Erkennung (gleiche IP = gleicher Hash)
- Keine Rückauflösung auf Original-IP möglich
- Salt durch ENCRYPTION_KEY → weitere Anonymisierung

### 7. Separate Tokens für Lesen und Schreiben

**Entscheidung:** `accessToken` (im QR-Code) ≠ `editToken` (für Verwaltung).

**Begründung:**
- QR-Code öffentlich sichtbar → Lese-Token ist "verbrannt"
- Bearbeitungsrechte erfordern separates Geheimnis
- Kompromittierung des QR-Codes erlaubt kein Ändern/Löschen

## Bekannte Grenzen und Risiken

| Risiko | Bewertung | Mitigation |
|---|---|---|
| Server-Kompromittierung | Hoch → alle Daten lesbar | Regelmäßige Updates, Minimale Angriffsfläche |
| QR-Code von Unbefugten gescannt | Mittel | PIN-Schutz, Warnhinweise an Nutzer |
| Social Engineering (falscher Schlüssel-Standort) | Niedrig | Nutzerverantwortung, Disclaimer |
| DDoS auf Abrufseite | Mittel | Nginx Rate Limiting, CDN |
| ENCRYPTION_KEY-Verlust | Kritisch → Datenverlust | Backup-Dokumentation, Key-Sicherung |

## Sicherheits-Checkliste für Betreiber

- [ ] ENCRYPTION_KEY sicher generiert (nicht der Beispielwert!)
- [ ] ENCRYPTION_KEY an sicherem Ort gesichert
- [ ] Datenbank nicht von außen erreichbar
- [ ] HTTPS mit gültigem Zertifikat
- [ ] Security Headers in Nginx konfiguriert
- [ ] Firewall konfiguriert
- [ ] Automatische OS-Security-Updates
- [ ] Regelmäßige Backups (inkl. Test des Restores!)
- [ ] Log-Monitoring eingerichtet
- [ ] Prisma Client in Produktion nicht als Admin verbunden

## Empfehlungen für erhöhte Sicherheit

1. **Redis für Rate Limiting** – Persistent und skalierbar
2. **WAF (Web Application Firewall)** – z.B. ModSecurity, Cloudflare
3. **Fail2ban** – Automatische IP-Sperre bei Missbrauch
4. **Audit-Log-Export** – Regelmäßiger Export der Zugriffslogs
5. **Penetration Testing** – Vor Go-Live durch externen Dienstleister
6. **Content Security Policy** – Weitere Verschärfung möglich
7. **Subresource Integrity** – Für externe Ressourcen (keine im MVP)
