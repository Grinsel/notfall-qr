import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EmergencyForm } from "@/components/EmergencyForm";

export const metadata = {
  title: "Notfalldatensatz erstellen – Notfall-QR",
  description: "Erstellen Sie Ihren persönlichen Notfall-QR-Code mit wichtigen Informationen für Einsatzkräfte.",
};

export default function ErstellenPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Notfalldatensatz erstellen
            </h1>
            <p className="mt-2 text-gray-600">
              Füllen Sie die folgenden Felder aus. Nur die Bezeichnung ist ein Pflichtfeld &ndash;
              geben Sie so viele oder wenige Informationen ein, wie Sie möchten.
            </p>
          </div>

          <div className="card">
            <EmergencyForm mode="create" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
