import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Datenschutz – Notfall-QR",
};

export default function DatenschutzPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 prose prose-gray">
          <h1>Datenschutzhinweise</h1>
          <p className="text-sm text-gray-500 italic">
            Entwurf – Bitte durch einen Datenschutzbeauftragten prüfen lassen.
          </p>

          <h2>1. Verantwortlicher</h2>
          <p>
            [Name und Kontaktdaten des Betreibers einfügen]<br />
            E-Mail: [datenschutz@example.com]
          </p>

          <h2>2. Welche Daten wir erheben</h2>
          <p>Bei der Nutzung von Notfall-QR werden folgende Daten verarbeitet:</p>
          <ul>
            <li><strong>Notfallinformationen:</strong> Die von Ihnen eingegebenen Informationen zu Ihrer Wohnung (Zugangshinweise, Standort von Absperrhähnen, etc.). Diese werden verschlüsselt gespeichert (AES-256-GCM).</li>
            <li><strong>Titel/Bezeichnung:</strong> Die von Ihnen gewählte Bezeichnung des Objekts. Diese wird unverschlüsselt gespeichert, da sie auch bei PIN-geschützten Datensätzen angezeigt wird.</li>
            <li><strong>E-Mail-Adresse (optional):</strong> Falls angegeben, zur Wiederherstellung des Bearbeitungszugangs.</li>
            <li><strong>Zugriffsprotokoll:</strong> Bei jedem Abruf der Notfalldaten wird ein gekürzter, gehashter IP-Adress-Fingerprint und ein gekürzter User-Agent gespeichert. Dies dient dem Missbrauchsschutz. Eine Zuordnung zu Personen ist damit nicht möglich.</li>
          </ul>

          <h2>3. Rechtsgrundlage</h2>
          <p>
            Die Verarbeitung erfolgt auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO)
            durch die aktive Nutzung des Dienstes. Das Zugriffsprotokoll wird auf Grundlage
            berechtigter Interessen (Art. 6 Abs. 1 lit. f DSGVO) zum Schutz vor Missbrauch geführt.
          </p>

          <h2>4. Speicherdauer</h2>
          <ul>
            <li>Notfalldaten: Bis zur Löschung durch den Nutzer oder bis zur Löschung durch den Betreiber bei langfristiger Inaktivität.</li>
            <li>Zugriffsprotokolle: 90 Tage, danach automatische Löschung.</li>
          </ul>

          <h2>5. Verschlüsselung und Sicherheit</h2>
          <p>
            Alle Notfallinformationen werden mit AES-256-GCM verschlüsselt gespeichert.
            Die Übertragung erfolgt ausschließlich über HTTPS (TLS). Der QR-Code enthält
            keine Klartextdaten, sondern nur einen Link mit einem kryptographisch starken Token.
          </p>

          <h2>6. Ihre Rechte</h2>
          <p>Sie haben das Recht auf:</p>
          <ul>
            <li>Auskunft über die gespeicherten Daten</li>
            <li>Berichtigung unrichtiger Daten</li>
            <li>Löschung Ihrer Daten (über den Bearbeitungslink jederzeit selbst möglich)</li>
            <li>Einschränkung der Verarbeitung</li>
            <li>Datenübertragbarkeit</li>
            <li>Widerspruch gegen die Verarbeitung</li>
            <li>Beschwerde bei einer Aufsichtsbehörde</li>
          </ul>

          <h2>7. Cookies und Tracking</h2>
          <p>
            Notfall-QR verwendet keine Cookies, kein Tracking und keine Analysedienste.
            Es werden keine Daten an Dritte weitergegeben.
          </p>

          <h2>8. Hosting</h2>
          <p>
            Die Anwendung wird auf Servern in [Deutschland/EU] gehostet.
            [Details zum Hosting-Anbieter einfügen]
          </p>

          <h2>9. Kontakt</h2>
          <p>
            Bei Fragen zum Datenschutz wenden Sie sich an:
            [E-Mail-Adresse einfügen]
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
