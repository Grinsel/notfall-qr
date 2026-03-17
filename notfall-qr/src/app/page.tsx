import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-b from-primary-50 to-white py-16 sm:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 text-primary-700 px-4 py-1.5 text-sm font-medium mb-6">
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
              </svg>
              Schnelle Hilfe im Ernstfall
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-6">
              Notfallinformationen für<br />
              <span className="text-primary-600">Einsatzkräfte</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Hinterlegen Sie wichtige Informationen zu Ihrer Wohnung &ndash; Schlüsselstandort,
              Absperrhähne, Sicherungskasten. Ein QR-Code an der Haustür macht diese Daten
              im Ernstfall schnell zugänglich.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/erstellen" className="btn-primary text-base px-8 py-3">
                Jetzt QR-Code erstellen
              </Link>
              <a href="#wie-funktioniert-es" className="btn-secondary text-base px-8 py-3">
                So funktioniert&apos;s
              </a>
            </div>
          </div>
        </section>

        {/* Wie funktioniert es */}
        <section id="wie-funktioniert-es" className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">So funktioniert es</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Informationen eingeben",
                  desc: "Tragen Sie ein, wo sich Schlüssel, Gas-Absperrhahn, Sicherungskasten und Wasser-Haupthahn befinden.",
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  ),
                },
                {
                  step: "2",
                  title: "QR-Code erhalten",
                  desc: "Ein sicherer QR-Code wird generiert. Drucken Sie ihn aus oder bestellen Sie einen Aufkleber.",
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                    </svg>
                  ),
                },
                {
                  step: "3",
                  title: "An der Tür anbringen",
                  desc: "Bringen Sie den QR-Code sichtbar an Ihrer Haustür an. Im Notfall scannen Einsatzkräfte den Code.",
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                  ),
                },
              ].map((item) => (
                <div key={item.step} className="card text-center">
                  <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-4">
                    {item.icon}
                  </div>
                  <div className="text-sm font-medium text-primary-600 mb-1">Schritt {item.step}</div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Wichtige Hinweise */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">Wichtige Hinweise</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Bitte lesen Sie diese Hinweise sorgfältig, bevor Sie den Dienst nutzen.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card border-l-4 border-l-warning-500">
                <h3 className="font-semibold mb-2">Keine Garantie der Nutzung</h3>
                <p className="text-sm text-gray-600">
                  Es besteht kein Anspruch darauf, dass Feuerwehr, Polizei oder Rettungsdienst den QR-Code
                  tatsächlich scannen oder die Informationen nutzen. Einsatzkräfte handeln nach eigenem Ermessen
                  und ihren Einsatzrichtlinien.
                </p>
              </div>
              <div className="card border-l-4 border-l-warning-500">
                <h3 className="font-semibold mb-2">Sicherheitsrisiken</h3>
                <p className="text-sm text-gray-600">
                  Ein sichtbar angebrachter QR-Code kann von jeder Person gescannt werden &ndash; nicht nur von
                  Einsatzkräften. Überlegen Sie sorgfältig, welche Informationen Sie hinterlegen. Nutzen Sie
                  den optionalen PIN-Schutz für sensible Details.
                </p>
              </div>
              <div className="card border-l-4 border-l-primary-500">
                <h3 className="font-semibold mb-2">Ihre Verantwortung</h3>
                <p className="text-sm text-gray-600">
                  Sie entscheiden selbst, welche Informationen Sie eingeben und öffentlich zugänglich machen.
                  Geben Sie keine Alarmcodes, Tresor-Kombinationen oder ähnlich kritische Daten ein.
                </p>
              </div>
              <div className="card border-l-4 border-l-primary-500">
                <h3 className="font-semibold mb-2">Kein offizieller Dienst</h3>
                <p className="text-sm text-gray-600">
                  Notfall-QR steht in keiner offiziellen Verbindung zu Behörden oder Rettungsdiensten.
                  Es handelt sich um ein unabhängiges Angebot zur freiwilligen Informationsbereitstellung.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sicherheitskonzept */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">Ihre Daten sind geschützt</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Verschlüsselung", desc: "Alle Notfalldaten werden mit AES-256 verschlüsselt gespeichert." },
                { title: "Kein Klartext im QR", desc: "Der QR-Code enthält nur einen sicheren Link, keine Daten." },
                { title: "Optionaler PIN", desc: "Schützen Sie Details zusätzlich mit einer PIN." },
                { title: "Jederzeit löschbar", desc: "Deaktivieren oder löschen Sie Ihren Datensatz jederzeit." },
              ].map((item) => (
                <div key={item.title} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-success-50 text-success-600 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">Häufige Fragen</h2>
            <div className="space-y-4">
              {[
                {
                  q: "Was kostet der Dienst?",
                  a: "Die Erstellung und Nutzung des QR-Codes ist kostenlos. Sie drucken den QR-Code selbst aus. Optional können in Zukunft wetterfeste Aufkleber bestellt werden.",
                },
                {
                  q: "Welche Informationen sollte ich eintragen?",
                  a: "Standort von Gas-Absperrhahn, Sicherungskasten und Wasser-Haupthahn sowie Zugangshinweise (z. B. Schlüssel beim Nachbarn). Vermeiden Sie sensible Daten wie Alarmcodes.",
                },
                {
                  q: "Wer kann die Daten sehen?",
                  a: "Jede Person, die den QR-Code scannt. Mit dem optionalen PIN-Schutz werden Details erst nach Eingabe einer PIN angezeigt. Der Titel bleibt immer sichtbar.",
                },
                {
                  q: "Kann ich die Daten ändern oder löschen?",
                  a: "Ja, über Ihren persönlichen Bearbeitungslink können Sie Daten jederzeit bearbeiten, den QR-Code deaktivieren oder den gesamten Datensatz löschen.",
                },
                {
                  q: "Nutzt die Feuerwehr den QR-Code wirklich?",
                  a: "Es gibt keine Garantie. Der QR-Code ist ein freiwilliges Angebot. Ob Einsatzkräfte ihn scannen, liegt in deren Ermessen und hängt von der Einsatzsituation ab.",
                },
                {
                  q: "Wie sicher sind meine Daten?",
                  a: "Alle Notfallinformationen werden verschlüsselt gespeichert (AES-256). Der QR-Code enthält nur einen Link mit einem kryptographischen Token – keine Klartextdaten. Zusätzlich können Sie einen PIN-Schutz aktivieren.",
                },
              ].map((item) => (
                <details key={item.q} className="card group">
                  <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                    {item.q}
                    <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </summary>
                  <p className="mt-3 text-sm text-gray-600">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary-600">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Jetzt Notfallinformationen hinterlegen
            </h2>
            <p className="text-primary-100 mb-8">
              In wenigen Minuten erstellen Sie Ihren persönlichen Notfall-QR-Code.
            </p>
            <Link
              href="/erstellen"
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 text-base font-semibold text-primary-700 shadow-sm hover:bg-primary-50 transition-colors"
            >
              Kostenlos erstellen
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
