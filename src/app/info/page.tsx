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

          {/* Datenkategorien */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Was bringt jede Information im Notfall?</h2>
            <div className="space-y-2">
              <details className="group rounded-lg border border-gray-200 bg-gray-50">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-900 select-none">
                  Name / Alias
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                  <p className="mb-2">Rettungskr&auml;fte k&ouml;nnen Sie direkt ansprechen &ndash; das schafft Vertrauen und erleichtert die Kommunikation, besonders wenn Sie verwirrt oder bewusstlos sind.</p>
                  <p className="text-gray-500"><strong>Datenschutz-Tipp:</strong> Verwenden Sie einen Alias oder Vornamen mit abgek&uuml;rztem Nachnamen.</p>
                </div>
              </details>

              <details className="group rounded-lg border border-gray-200 bg-gray-50">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-900 select-none">
                  Blutgruppe
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                  <p className="mb-2">Bei schweren Verletzungen mit Blutverlust kann die bekannte Blutgruppe lebensrettend sein &ndash; die Notaufnahme kann sofort passende Blutkonserven bereitstellen, statt auf den Labortest zu warten.</p>
                  <p className="text-gray-500"><strong>Datenschutz-Tipp:</strong> Die Blutgruppe allein erlaubt keine R&uuml;ckschl&uuml;sse auf Ihre Identit&auml;t.</p>
                </div>
              </details>

              <details className="group rounded-lg border border-gray-200 bg-gray-50">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-900 select-none">
                  Vorerkrankungen
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                  <p className="mb-2">Chronische Erkrankungen wie Diabetes, Epilepsie oder Herzerkrankungen beeinflussen direkt die Erstversorgung. Der Rettungsdienst kann so z.B. bei einer Bewusstlosigkeit sofort eine Unterzuckerung in Betracht ziehen.</p>
                  <p className="text-gray-500"><strong>Datenschutz-Tipp:</strong> Nennen Sie nur akut relevante Erkrankungen, nicht Ihre vollst&auml;ndige Krankengeschichte.</p>
                </div>
              </details>

              <details className="group rounded-lg border border-gray-200 bg-gray-50">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-900 select-none">
                  Allergien
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                  <p className="mb-2">Medikamenten-Allergien (z.B. Penicillin, Ibuprofen) oder Latex-Allergien k&ouml;nnen im Notfall lebensgef&auml;hrlich werden. Rettungskr&auml;fte vermeiden dann sofort die betreffenden Stoffe.</p>
                  <p className="text-gray-500"><strong>Datenschutz-Tipp:</strong> Allergien allein lassen kaum R&uuml;ckschl&uuml;sse auf Ihre Person zu.</p>
                </div>
              </details>

              <details className="group rounded-lg border border-gray-200 bg-gray-50">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-900 select-none">
                  Medikamente
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                  <p className="mb-2">Regelm&auml;&szlig;ig eingenommene Medikamente (besonders Blutverd&uuml;nner, Insulin, Herzmedikamente) beeinflussen die Behandlung. Wechselwirkungen mit Notfallmedikamenten k&ouml;nnen so vermieden werden.</p>
                  <p className="text-gray-500"><strong>Datenschutz-Tipp:</strong> Medikamentennamen mit Dosierung reichen. Keine Diagnosen nötig, wenn Sie sie nicht angeben möchten.</p>
                </div>
              </details>

              <details className="group rounded-lg border border-gray-200 bg-gray-50">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-900 select-none">
                  Implantate
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                  <p className="mb-2">Herzschrittmacher, Defibrillatoren, k&uuml;nstliche Gelenke oder Metallimplantate sind wichtig f&uuml;r bildgebende Diagnostik (MRT) und Defibrillation.</p>
                  <p className="text-gray-500"><strong>Datenschutz-Tipp:</strong> Nennen Sie den Typ des Implantats, nicht den Grund daf&uuml;r.</p>
                </div>
              </details>

              <details className="group rounded-lg border border-gray-200 bg-gray-50">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-900 select-none">
                  Notfallkontakte
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                  <p className="mb-2">Angeh&ouml;rige k&ouml;nnen im Notfall wichtige medizinische Ausk&uuml;nfte geben und schnelle Entscheidungen treffen. Au&szlig;erdem werden sie so schnellstm&ouml;glich informiert.</p>
                  <p className="text-gray-500"><strong>Datenschutz-Tipp:</strong> Verwenden Sie abgek&uuml;rzte Namen (z.B. &bdquo;Maria M.&ldquo;) und nur Mobilnummern.</p>
                </div>
              </details>

              <details className="group rounded-lg border border-gray-200 bg-gray-50">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-900 select-none">
                  Ersatzschluessel
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                  <p className="mb-2">Wenn die Wohnungst&uuml;r verschlossen ist, muss die Feuerwehr sie aufbrechen &ndash; das kostet Zeit und besch&auml;digt die T&uuml;r. Ein hinterlegter Ersatzschl&uuml;ssel beschleunigt den Zugang erheblich.</p>
                  <p className="text-gray-500"><strong>Datenschutz-Tipp:</strong> Schreiben Sie nur &bdquo;bei Nachbarin, 2. OG links&ldquo; &ndash; nicht den vollst&auml;ndigen Namen und Adresse.</p>
                </div>
              </details>

              <details className="group rounded-lg border border-gray-200 bg-gray-50">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-900 select-none">
                  Notfalldose im Kuehlschrank
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                  <p className="mb-2">Die Notfalldose (SOS-Dose) ist ein standardisiertes System: Eine Dose im K&uuml;hlschrank enth&auml;lt medizinische Informationen. Rettungskr&auml;fte wissen, wo sie suchen m&uuml;ssen, wenn dieser Hinweis vorhanden ist.</p>
                </div>
              </details>

              <details className="group rounded-lg border border-gray-200 bg-gray-50">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-900 select-none">
                  Heizungsart / Absperrhahn
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                  <p className="mb-2">Bei Bra&#776;nden oder Gasgeruch muss die Heizung sofort abgesperrt werden. Wenn Rettungskr&auml;fte wissen, ob Gas, &Ouml;l oder Fernw&auml;rme verbaut ist und wo der Absperrhahn sitzt, spart das im Ernstfall wertvolle Minuten.</p>
                </div>
              </details>

              <details className="group rounded-lg border border-gray-200 bg-gray-50">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-900 select-none">
                  Solaranlage
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                  <p className="mb-2">Photovoltaik-Anlagen stehen unter Spannung, solange Licht auf die Module f&auml;llt &ndash; auch wenn der Strom im Haus abgeschaltet ist. Das ist ein ernstes Risiko bei L&ouml;scharbeiten. Die Feuerwehr muss wissen, ob eine Anlage vorhanden ist und wo die Hauptsicherung liegt.</p>
                </div>
              </details>

              <details className="group rounded-lg border border-gray-200 bg-gray-50">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-900 select-none">
                  Haustiere
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                  <p className="mb-2">Rettungskr&auml;fte suchen auch nach Tieren. Angaben zur Art, Anzahl und zum Verhalten (z.B. &bdquo;Hund bei&szlig;t bei Fremden&ldquo;, &bdquo;Katze versteckt sich unter dem Bett&ldquo;) helfen, Tiere zu finden und sicher zu bergen.</p>
                </div>
              </details>

              <details className="group rounded-lg border border-gray-200 bg-gray-50">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-900 select-none">
                  Hausarzt / Hausaerztin
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                  <p className="mb-2">Der Hausarzt kennt die vollst&auml;ndige Krankengeschichte und kann im Notfall telefonisch wichtige Informationen an den Rettungsdienst oder die Notaufnahme weitergeben.</p>
                  <p className="text-gray-500"><strong>Datenschutz-Tipp:</strong> Praxisname und Stadtteil reichen &ndash; keine vollst&auml;ndige Adresse n&ouml;tig.</p>
                </div>
              </details>

              <details className="group rounded-lg border border-gray-200 bg-gray-50">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-900 select-none">
                  Organspender
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                  <p className="mb-2">Im schlimmsten Fall kann diese Angabe anderen Menschen das Leben retten. &Auml;rzte wissen sofort, ob eine Organspende in Frage kommt.</p>
                  <p className="text-gray-500"><strong>Datenschutz-Tipp:</strong> Ein einfaches &bdquo;Ja&ldquo; oder &bdquo;Nein&ldquo; &ndash; keine sensiblen Daten.</p>
                </div>
              </details>

              <details className="group rounded-lg border border-gray-200 bg-gray-50">
                <summary className="cursor-pointer px-4 py-3 font-medium text-gray-900 select-none">
                  Krankenkasse
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                  <p className="mb-2">Beschleunigt die Aufnahme im Krankenhaus und vermeidet Verz&ouml;gerungen bei der Abrechnung. Nicht medizinisch relevant, aber organisatorisch hilfreich.</p>
                  <p className="text-gray-500"><strong>Datenschutz-Tipp:</strong> Nur der Name der Kasse reicht &ndash; keine Versichertennummer angeben.</p>
                </div>
              </details>
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
