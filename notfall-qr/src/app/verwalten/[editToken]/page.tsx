"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EmergencyForm } from "@/components/EmergencyForm";
import Link from "next/link";

export default function VerwaltenPage() {
  const params = useParams();
  const editToken = params.editToken as string;
  const [initialData, setInitialData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRecord() {
      try {
        const res = await fetch(`/api/records/${editToken}`);
        if (!res.ok) throw new Error("Datensatz nicht gefunden");
        const data = await res.json();
        setInitialData({ ...data, pin: "" }); // PIN nicht vorausfüllen
      } catch (err) {
        setError(err instanceof Error ? err.message : "Fehler beim Laden");
      } finally {
        setLoading(false);
      }
    }
    loadRecord();
  }, [editToken]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
        </main>
        <Footer />
      </>
    );
  }

  if (error || !initialData) {
    return (
      <>
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="card text-center max-w-md">
            <p className="text-emergency-600 mb-4">{error || "Datensatz nicht gefunden"}</p>
            <Link href="/erstellen" className="btn-primary">
              Neuen Datensatz erstellen
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Datensatz bearbeiten
              </h1>
              <p className="mt-1 text-gray-600 text-sm">
                Ändern Sie Ihre Notfallinformationen. Der QR-Code bleibt unverändert.
              </p>
            </div>
            <Link
              href={`/qr/${editToken}`}
              className="btn-secondary text-sm"
            >
              Zurück zum QR-Code
            </Link>
          </div>

          <div className="card">
            <EmergencyForm
              mode="edit"
              initialData={{
                title: (initialData.title as string) || "",
                accessInfo: (initialData.accessInfo as string) || "",
                gasShutoff: (initialData.gasShutoff as string) || "",
                electricPanel: (initialData.electricPanel as string) || "",
                waterShutoff: (initialData.waterShutoff as string) || "",
                additionalNotes: (initialData.additionalNotes as string) || "",
                contactPerson: (initialData.contactPerson as string) || "",
                pets: (initialData.pets as string) || "",
                pin: "",
                email: (initialData.email as string) || "",
                editToken,
              }}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
