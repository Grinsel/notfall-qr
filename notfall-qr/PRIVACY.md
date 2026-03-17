# Datenschutzkonzept – Notfall-QR

## Grundsätze

Notfall-QR folgt dem Prinzip der **Datensparsamkeit** nach Art. 5 Abs. 1 lit. c DSGVO:

- Keine Registrierung erforderlich
- Keine Cookies
- Kein Tracking / Analytics
- Keine Weitergabe an Dritte
- Minimale Datenerhebung
- Verschlüsselte Speicherung

## Erhobene Daten

### Vom Nutzer eingegebene Daten

| Feld | Pflicht | Verschlüsselt | Öffentlich via QR |
|---|---|---|---|
| Titel/Bezeichnung | Ja | Nein | Ja (immer sichtbar) |
| Zugangshinweise | Nein | Ja | Ja (oder hinter PIN) |
| Gas-Absperrhahn | Nein | Ja | Ja (oder hinter PIN) |
| Sicherungskasten | Nein | Ja | Ja (oder hinter PIN) |
| Wasser-Haupthahn | Nein | Ja | Ja (oder hinter PIN) |
| Weitere Hinweise | Nein | Ja | Ja (oder hinter PIN) |
| Kontaktperson | Nein | Ja | Ja (oder hinter PIN) |
| Haustiere | Nein | Ja | Ja (oder hinter PIN) |
| PIN | Nein | Gehasht | Nein |
| E-Mail | Nein | Nein* | Nein |

*E-Mail wird unverschlüsselt gespeichert, da sie für Magic-Link-Funktionalität benötigt wird. Sie wird nie öffentlich angezeigt.

### Automatisch erhobene Daten (Zugriffsprotokoll)

| Datum | Zweck | Speicherdauer | Personenbezug |
|---|---|---|---|
| Gehashte IP (16 Zeichen) | Missbrauchserkennung | 90 Tage | Pseudonymisiert |
| User-Agent (gekürzt, 100 Zeichen) | Missbrauchserkennung | 90 Tage | Pseudonymisiert |
| Zeitstempel | Missbrauchserkennung | 90 Tage | Nein |
| Zugriffsart | Audit | 90 Tage | Nein |

### Nicht erhobene Daten

- Keine vollständigen IP-Adressen
- Keine Standortdaten
- Keine Gerätekennungen
- Keine Cookies oder Local Storage
- Keine Tracking-Pixel
- Keine Analytics-Dienste

## Datenflusskontrolle

```
Nutzer-Browser ──HTTPS──→ Server ──→ Verschlüsselung ──→ Datenbank (verschlüsselt)
                                          ↑
                                   ENCRYPTION_KEY
                                   (nur auf Server)
```

## Rechte der Betroffenen (Art. 15-22 DSGVO)

| Recht | Umsetzung |
|---|---|
| Auskunft (Art. 15) | Über Bearbeitungslink alle Daten einsehbar |
| Berichtigung (Art. 16) | Über Bearbeitungslink jederzeit änderbar |
| Löschung (Art. 17) | Über Bearbeitungslink jederzeit löschbar |
| Einschränkung (Art. 18) | QR-Code deaktivierbar |
| Datenübertragbarkeit (Art. 20) | GET-API liefert alle Daten als JSON |
| Widerspruch (Art. 21) | Datensatz kann gelöscht werden |

## Empfehlungen für den Betreiber

1. **Datenschutzbeauftragten benennen** (falls erforderlich nach Art. 37 DSGVO)
2. **Verzeichnis der Verarbeitungstätigkeiten** anlegen (Art. 30 DSGVO)
3. **Datenschutz-Folgenabschätzung** prüfen (Art. 35 DSGVO) – empfohlen wegen Notfalldaten
4. **Auftragsverarbeitungsvertrag** mit Hosting-Anbieter abschließen
5. **Automatische Löschung** inaktiver Datensätze nach 24 Monaten implementieren
6. **Log-Rotation** sicherstellen (90-Tage-Löschung)
7. **Verschlüsselungsschlüssel-Management** dokumentieren

## DSGVO-Konformitätsstatus

| Anforderung | Status | Anmerkung |
|---|---|---|
| Rechtsgrundlage (Art. 6) | ✅ | Einwilligung durch Nutzung |
| Datensparsamkeit (Art. 5) | ✅ | Minimal nötige Daten |
| Verschlüsselung (Art. 32) | ✅ | AES-256-GCM + HTTPS |
| Betroffenenrechte (Art. 15-22) | ✅ | Self-Service über Bearbeitungslink |
| Datenschutzhinweise (Art. 13) | ⚠️ | Entwurf vorhanden, rechtliche Prüfung nötig |
| Verarbeitungsverzeichnis (Art. 30) | ⚠️ | Muss vom Betreiber erstellt werden |
| Auftragsverarbeitung (Art. 28) | ⚠️ | AVV mit Hoster nötig |
| DSFA (Art. 35) | ⚠️ | Empfohlen, muss durchgeführt werden |
