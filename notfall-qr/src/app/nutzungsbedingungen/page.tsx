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
            Entwurf – Bitte rechtlich prüfen lassen.
          </p>

          <h2>1. Leistungsbeschreibung</h2>
          <p>
            Notfall-QR ermöglicht es Nutzern, Notfallinformationen zu ihrer Wohnung digital zu
            hinterlegen und einen QR-Code zu erzeugen, der an der Haustür angebracht werden kann.
            Der Dienst ist kostenlos.
          </p>

          <h2>2. Keine Garantien</h2>
          <ul>
            <li>Es wird <strong>nicht garantiert</strong>, dass Einsatzkräfte den QR-Code scannen oder die Informationen nutzen.</li>
            <li>Es wird <strong>nicht garantiert</strong>, dass der Dienst jederzeit verfügbar ist.</li>
            <li>Es wird <strong>nicht garantiert</strong>, dass die gespeicherten Informationen im Notfall abrufbar sind (z. B. bei Serverausfall, Internetausfall, beschädigtem QR-Code).</li>
          </ul>

          <h2>3. Eigenverantwortung des Nutzers</h2>
          <p>
            Der Nutzer ist selbst dafür verantwortlich:
          </p>
          <ul>
            <li>Welche Informationen er eingibt und über den QR-Code zugänglich macht</li>
            <li>Ob und wo er den QR-Code anbringt</li>
            <li>Seinen Bearbeitungslink sicher aufzubewahren</li>
            <li>Informationen aktuell zu halten</li>
            <li>Keine falschen, irreführenden oder rechtswidrigen Informationen einzugeben</li>
          </ul>

          <h2>4. Sicherheitshinweise</h2>
          <ul>
            <li>Ein sichtbar angebrachter QR-Code kann von <strong>jeder Person</strong> gescannt werden, nicht nur von Einsatzkräften.</li>
            <li>Geben Sie <strong>keine hochsensiblen Informationen</strong> ein (Alarmcodes, Tresor-Kombinationen, Wertgegenstände-Standorte).</li>
            <li>Nutzen Sie den optionalen PIN-Schutz für zusätzliche Sicherheit.</li>
            <li>Informationen wie Schlüsselstandorte können auch von Unbefugten genutzt werden. Wägen Sie das Risiko sorgfältig ab.</li>
          </ul>

          <h2>5. Haftungsausschluss</h2>
          <p>
            Der Betreiber haftet nicht für:
          </p>
          <ul>
            <li>Schäden, die durch die Nutzung oder Nichtnutzung der bereitgestellten Informationen entstehen</li>
            <li>Missbrauch der über den QR-Code zugänglichen Informationen durch Dritte</li>
            <li>Nichtverfügbarkeit des Dienstes</li>
            <li>Datenverlust</li>
          </ul>
          <p>
            Die Haftung für Vorsatz und grobe Fahrlässigkeit bleibt unberührt.
          </p>

          <h2>6. Datenlöschung</h2>
          <p>
            Nutzer können ihre Datensätze jederzeit über den Bearbeitungslink selbst löschen.
            Der Betreiber behält sich vor, Datensätze nach längerer Inaktivität (mehr als 24 Monate)
            zu löschen.
          </p>

          <h2>7. Missbrauch</h2>
          <p>
            Der Betreiber behält sich vor, Datensätze zu deaktivieren oder zu löschen, wenn
            begründeter Verdacht auf Missbrauch besteht (z. B. falsche Notfallinformationen,
            rechtswidrige Inhalte).
          </p>

          <h2>8. Änderungen</h2>
          <p>
            Der Betreiber behält sich vor, diese Nutzungsbedingungen jederzeit zu ändern.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
