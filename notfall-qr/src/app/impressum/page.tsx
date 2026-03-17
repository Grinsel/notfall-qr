import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Impressum – Notfall-QR",
};

export default function ImpressumPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 prose prose-gray">
          <h1>Impressum</h1>
          <p className="text-sm text-gray-500 italic">
            Platzhalter – Bitte mit den tatsächlichen Angaben des Betreibers ersetzen.
          </p>

          <h2>Angaben gemäß § 5 TMG</h2>
          <p>
            [Vor- und Nachname / Firmenname]<br />
            [Straße und Hausnummer]<br />
            [PLZ Ort]<br />
            [Land]
          </p>

          <h2>Kontakt</h2>
          <p>
            Telefon: [Telefonnummer]<br />
            E-Mail: [E-Mail-Adresse]
          </p>

          <h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
          <p>
            [Vor- und Nachname]<br />
            [Anschrift]
          </p>

          <h2>Haftungsausschluss</h2>

          <h3>Haftung für Inhalte</h3>
          <p>
            Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit,
            Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
            Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten
            nach den allgemeinen Gesetzen verantwortlich.
          </p>

          <h3>Haftung für Links</h3>
          <p>
            Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen
            Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
          </p>

          <h3>Keine offizielle Zusammenarbeit</h3>
          <p>
            Notfall-QR steht in <strong>keiner offiziellen Verbindung</strong> zu Feuerwehr, Polizei,
            Rettungsdienst oder sonstigen Behörden. Es handelt sich um ein unabhängiges, privates
            Angebot. Es besteht kein Anspruch darauf, dass Einsatzkräfte die bereitgestellten
            Informationen nutzen.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
