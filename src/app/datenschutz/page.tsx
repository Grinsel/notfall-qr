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
          <h1>Datenschutzerklärung</h1>

          <h2>1. Verantwortlicher</h2>
          <p>
            Florian Müller<br />
            Am Winkel 14<br />
            35708 Haiger-Steinbach<br />
            E-Mail: info@retter.one<br />
            Telefon: +49 170 9326875
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
            <li>Es wird <strong>kein Tracking</strong> eingesetzt (kein Google Analytics, keine Werbung).</li>
            <li>Es werden <strong>keine IP-Adressen</strong> dauerhaft gespeichert.</li>
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
            Die Webseite wird auf Servern von Railway (Railway Corporation, San Francisco, USA)
            gehostet. Beim Aufruf der Seite fallen technisch bedingt Server-Logdaten an
            (IP-Adresse, Zeitpunkt, aufgerufene Seite). Diese enthalten jedoch
            keine Notfalldaten, da diese ausschließlich im URL-Hash gespeichert
            sind, der nicht an den Server übermittelt wird.
          </p>

          <h2>5. Ihre Rechte</h2>
          <p>
            Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der
            Verarbeitung Ihrer Daten. Da keine personenbezogenen Daten auf unseren Servern
            gespeichert werden, entfallen die üblichen Auskunfts- und Löschungsanfragen.
            Sollten Sie dennoch Fragen haben, wenden Sie sich an: info@retter.one
          </p>

          <h2>6. Kontakt</h2>
          <p>
            Bei Fragen zum Datenschutz wenden Sie sich an:<br />
            Florian Müller<br />
            E-Mail: info@retter.one<br />
            Telefon: +49 170 9326875
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
