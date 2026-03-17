import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Nutzungsbedingungen – Notfall-QR",
};

export default function NutzungsbedingungenPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 prose prose-gray">
          <h1>Nutzungsbedingungen</h1>
          <p className="text-sm text-gray-500 italic">
            Entwurf &ndash; Bitte rechtlich prüfen lassen.
          </p>

          <h2>1. Leistungsbeschreibung</h2>
          <p>
            Notfall-QR ermöglicht es Nutzern, Notfallinformationen in einen QR-Code zu verschlüsseln,
            der an der Haustür angebracht werden kann. Alle Daten werden ausschließlich im QR-Code
            selbst gespeichert &ndash; es findet keine serverseitige Datenspeicherung statt.
            Der Dienst ist kostenlos.
          </p>

          <h2>2. Keine Garantien</h2>
          <ul>
            <li>Es wird <strong>nicht garantiert</strong>, dass Einsatzkräfte den QR-Code scannen oder die Informationen nutzen.</li>
            <li>Es wird <strong>nicht garantiert</strong>, dass der Dienst jederzeit verfügbar ist.</li>
            <li>Es wird <strong>nicht garantiert</strong>, dass der QR-Code in jeder Situation lesbar ist (z.B. bei Beschädigung, schlechter Druckqualität).</li>
          </ul>

          <h2>3. Eigenverantwortung des Nutzers</h2>
          <p>Der Nutzer ist selbst dafür verantwortlich:</p>
          <ul>
            <li>Welche Informationen er in den QR-Code aufnimmt</li>
            <li>Dass jede Person, die den QR-Code scannt, die Daten lesen kann</li>
            <li>Den QR-Code sicher aufzubewahren (bei Verlust sind die Daten weg)</li>
            <li>Keine falschen, irreführenden oder rechtswidrigen Informationen einzugeben</li>
          </ul>

          <h2>4. Sicherheitshinweise</h2>
          <ul>
            <li>Ein sichtbar angebrachter QR-Code kann von <strong>jeder Person</strong> gescannt werden.</li>
            <li>Geben Sie <strong>keine hochsensiblen Informationen</strong> ein (Alarmcodes, Tresor-Kombinationen, Passwörter, Finanzdaten).</li>
            <li>Informationen wie Schlüsselstandorte können auch von Unbefugten genutzt werden. Wägen Sie das Risiko sorgfältig ab.</li>
          </ul>

          <h2>5. Haftungsausschluss</h2>
          <p>Der Betreiber haftet nicht für:</p>
          <ul>
            <li>Schäden, die durch die Nutzung oder Nichtnutzung der im QR-Code enthaltenen Informationen entstehen</li>
            <li>Missbrauch der über den QR-Code zugänglichen Informationen durch Dritte</li>
            <li>Nichtverfügbarkeit des Dienstes</li>
            <li>Datenverlust (da keine serverseitige Speicherung stattfindet, liegt die Aufbewahrung beim Nutzer)</li>
          </ul>
          <p>Die Haftung für Vorsatz und grobe Fahrlässigkeit bleibt unberührt.</p>

          <h2>6. Keine offizielle Zusammenarbeit</h2>
          <p>
            Notfall-QR steht in <strong>keiner offiziellen Verbindung</strong> zu Feuerwehr, Polizei,
            Rettungsdienst oder sonstigen Behörden. Es besteht kein Anspruch darauf, dass
            Einsatzkräfte die bereitgestellten Informationen nutzen.
          </p>

          <h2>7. Änderungen</h2>
          <p>Der Betreiber behält sich vor, diese Nutzungsbedingungen jederzeit zu ändern.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
