import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-primary-50 to-white py-20 sm:py-32">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-6">
              Notfallinformationen für{" "}
              <span className="text-primary-600">Einsatzkräfte</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              Erstellen Sie einen QR-Code mit wichtigen Informationen zu Ihrer Wohnung.
              An der Haustür angebracht, hilft er Feuerwehr und Rettungsdienst im Ernstfall.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/setup" className="btn-primary text-base px-8 py-3">
                QR-Code erstellen
              </Link>
              <Link href="/info" className="btn-secondary text-base px-8 py-3">
                Wie funktioniert das?
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
