import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Wie funktioniert es? – Notfall-QR",
};

export default function InfoPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Wie funktioniert Notfall-QR?</h1>

          {/* Was ist das */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Was ist Notfall-QR?</h2>
            <p className="text-gray-600 leading-relaxed">
              Notfall-QR erzeugt einen QR-Code, der wichtige Informationen für Einsatzkräfte enthält.
              Sie kleben den QR-Code an Ihre Haustür. Wenn Feuerwehr oder Rettungsdienst kommen,
              scannen sie den Code und sehen sofort, wo sich Schlüssel, Absperrhähne oder der
              Sicherungskasten befinden.
            </p>
          </section>

          {/* Technisch */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Wie funktioniert es technisch?</h2>
            <div className="space-y-3 text-gray-600 leading-relaxed">
              <p>
                Ihre Daten werden <strong>direkt in Ihrem Browser</strong> verschlüsselt und in die URL
                eingebettet, aus der der QR-Code erzeugt wird. Das Besondere: Es werden
                <strong> keine Daten auf einem Server gespeichert</strong>.
              </p>
              <p>
                Der QR-Code ist gleichzeitig Speicher und Schlüssel. Beim Scannen werden die Daten
                im Browser des Scanners entschlüsselt und angezeigt &ndash; ohne Serverzugriff.
              </p>
              <p>
                Der Teil der URL nach dem <code className="bg-gray-100 px-1 rounded">#</code>-Zeichen
                (der sogenannte &ldquo;Hash&rdquo;) wird vom Browser <strong>niemals</strong> an einen Server gesendet.
                Das ist ein fester Bestandteil des HTTP-Standards.
              </p>
            </div>
          </section>

          {/* Risiko */}
          <section className="mb-10">
            <div className="rounded-lg bg-warning-50 border border-warning-500 p-5">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Was ist das Risiko?</h2>
              <p className="text-gray-700 leading-relaxed">
                <strong>Jede Person, die den QR-Code scannt, kann die Daten lesen.</strong> Behandeln Sie
                den QR-Code wie einen Zettel an Ihrer Tür &ndash; alles, was draufsteht, kann jeder Passant
                lesen, der sein Handy zückt. Es gibt keinen PIN-Schutz und keine Zugriffskontrolle.
              </p>
            </div>
          </section>

          {/* Nutzen */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Was ist der Nutzen?</h2>
            <p className="text-gray-600 leading-relaxed">
              Im Notfall zählt jede Sekunde. Einsatzkräfte erhalten sofort die wichtigsten Informationen
              zu Ihrer Wohnung, ohne auf Nachbarn, Hausverwaltung oder aufgebrochene Türen warten zu müssen.
            </p>
          </section>

          {/* Was eintragen */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Was sollte ich eintragen?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="card bg-success-50 border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2">Empfohlen</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>Standort Ersatzschlüssel</li>
                  <li>Notfallkontakte (Name + Telefon)</li>
                  <li>Blutgruppe</li>
                  <li>Allergien / Medikamente</li>
                  <li>Name des Hausarztes</li>
                  <li>Gas-Absperrhahn, Sicherungskasten, Wasser-Haupthahn</li>
                  <li>Haustiere (Anzahl, Art, Verhalten)</li>
                </ul>
              </div>
              <div className="card bg-emergency-50 border border-red-200">
                <h3 className="font-semibold text-red-800 mb-2">Nicht eintragen</h3>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>Passwörter oder PINs</li>
                  <li>Bank- oder Finanzdaten</li>
                  <li>Vollständige Ausweisdaten</li>
                  <li>Alarmcodes</li>
                  <li>Tresor-Kombinationen</li>
                  <li>Standort von Wertgegenständen</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Tipp */}
          <section className="mb-10">
            <div className="rounded-lg bg-primary-50 border border-primary-200 p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Tipp</h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                Verwenden Sie einen Alias statt Ihres vollen Namens. Schreiben Sie z.B.
                &ldquo;Notfallkontakt: Maria M., 0171-...&rdquo; statt den vollständigen Namen mit Adresse.
                So bleiben die Informationen nützlich, ohne zu viel preiszugeben.
              </p>
            </div>
          </section>

          {/* CTA */}
          <div className="text-center pt-4">
            <Link href="/setup" className="btn-primary text-base px-8 py-3">
              Jetzt QR-Code erstellen
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
