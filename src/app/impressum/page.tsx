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

          <h2>Angaben gemaess &sect; 5 DDG</h2>
          <p>
            Florian Mueller<br />
            Am Winkel 14<br />
            35708 Haiger-Steinbach<br />
            Deutschland
          </p>

          <h2>Kontakt</h2>
          <p>
            Telefon: +49 170 9326875 (kein Support)<br />
            E-Mail: info@retter.one
          </p>

          <h2>Verantwortlich fuer den Inhalt nach &sect; 18 Abs. 2 MStV</h2>
          <p>
            Florian Mueller<br />
            Am Winkel 14<br />
            35708 Haiger-Steinbach
          </p>

          <h2>Haftungsausschluss</h2>

          <h3>Haftung fuer Inhalte</h3>
          <p>
            Die Inhalte unserer Seiten wurden mit groesster Sorgfalt erstellt. Fuer die Richtigkeit,
            Vollstaendigkeit und Aktualitaet der Inhalte koennen wir jedoch keine Gewaehr uebernehmen.
            Als Diensteanbieter sind wir gemaess &sect; 7 Abs. 1 DDG fuer eigene Inhalte auf diesen Seiten
            nach den allgemeinen Gesetzen verantwortlich.
          </p>

          <h3>Haftung fuer Links</h3>
          <p>
            Unser Angebot enthaelt Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen
            Einfluss haben. Deshalb koennen wir fuer diese fremden Inhalte auch keine Gewaehr uebernehmen.
            Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
          </p>

          <h3>Urheberrecht</h3>
          <p>
            Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
            dem deutschen Urheberrecht. &copy; {new Date().getFullYear()} Notfall-QR &ndash; Florian Mueller
          </p>

          <h3>Keine offizielle Zusammenarbeit</h3>
          <p>
            Notfall-QR steht in <strong>keiner offiziellen Verbindung</strong> zu Feuerwehr, Polizei,
            Rettungsdienst oder sonstigen Behoerden. Es handelt sich um ein unabhaengiges, privates
            Angebot. Es besteht kein Anspruch darauf, dass Einsatzkraefte die bereitgestellten
            Informationen nutzen.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
