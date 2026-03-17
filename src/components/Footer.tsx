import Link from "next/link";

export function Footer() {
  return (
    <footer className="no-print bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-gray-600">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Notfall-QR</h3>
            <p>Notfallinformationen für Einsatzkräfte – schnell und sicher.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Rechtliches</h3>
            <ul className="space-y-1">
              <li><Link href="/datenschutz" className="hover:text-primary-600">Datenschutz</Link></li>
              <li><Link href="/impressum" className="hover:text-primary-600">Impressum</Link></li>
              <li><Link href="/nutzungsbedingungen" className="hover:text-primary-600">Nutzungsbedingungen</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Hinweis</h3>
            <p className="text-xs">
              Dieses Angebot steht in keiner offiziellen Verbindung zu Feuerwehr,
              Polizei oder Rettungsdienst. Es besteht kein Anspruch darauf, dass
              Einsatzkräfte den QR-Code nutzen.
            </p>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-400 text-center">
          &copy; {new Date().getFullYear()} Notfall-QR. Alle Angaben ohne Gewähr.
        </div>
      </div>
    </footer>
  );
}
