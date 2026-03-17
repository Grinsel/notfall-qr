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
            Entwurf &ndash; Bitte durch einen Datenschutzbeauftragten prüfen lassen.
          </p>

          <h2>1. Verantwortlicher</h2>
          <p>
            [Name und Kontaktdaten des Betreibers einfügen]<br />
            E-Mail: [datenschutz@example.com]
          </p>

          <h2>2. Welche Daten wir erheben</h2>
          <p>
            <strong>Kurz gesagt: Keine.</strong> Notfall-QR speichert keine personenbezogenen Daten
            auf einem Server. Alle Informationen, die Sie eingeben, werden ausschließlich in Ihrem
            Browser verarbeitet und direkt in den QR-Code eingebettet.
          </p>
          <ul>
            <li>Es werden <strong>keine Notfalldaten</strong> an einen Server übertragen.</li>
            <li>Es werden <strong>keine Cookies</strong> gesetzt.</li>
            <li>Es wird <strong>kein Tracking</strong> eingesetzt.</li>
            <li>Es werden <strong>keine IP-Adressen</strong> gespeichert.</li>
          </ul>

          <h2>3. Verschlüsselung</h2>
          <p>
            Ihre Notfallinformationen werden mit AES-256-GCM im Browser verschlüsselt.
            Der Schlüssel ist Bestandteil der QR-Code-URL (im Hash-Fragment) und wird
            vom Browser niemals an einen Server gesendet. Ohne den QR-Code ist eine
            Entschlüsselung nicht möglich.
          </p>

          <h2>4. Hosting</h2>
          <p>
            Die Webseite selbst wird auf Servern in [Deutschland/EU] gehostet.
            Beim Aufruf der Seite fallen technisch bedingt Server-Logdaten an
            (IP-Adresse, Zeitpunkt, aufgerufene Seite). Diese enthalten jedoch
            keine Notfalldaten, da diese ausschließlich im URL-Hash gespeichert
            sind, der nicht an den Server übermittelt wird.
          </p>

          <h2>5. Ihre Rechte</h2>
          <p>
            Da keine personenbezogenen Daten auf unseren Servern gespeichert werden,
            entfallen die üblichen Auskunfts- und Löschungsanfragen. Sollten Sie dennoch
            Fragen haben, wenden Sie sich an: [E-Mail-Adresse einfügen]
          </p>

          <h2>6. Kontakt</h2>
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
