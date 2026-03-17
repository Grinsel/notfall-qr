"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";

interface RecordData {
  id: string;
  title: string;
  accessToken: string;
  editToken: string;
  isActive: boolean;
  hasPIN: boolean;
}

export default function QRPage() {
  const params = useParams();
  const router = useRouter();
  const editToken = params.editToken as string;
  const [record, setRecord] = useState<RecordData | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const qrRef = useRef<HTMLDivElement>(null);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const viewUrl = record ? `${baseUrl}/notfall/${record.accessToken}` : "";

  useEffect(() => {
    async function loadRecord() {
      try {
        const res = await fetch(`/api/records/${editToken}`);
        if (!res.ok) throw new Error("Datensatz nicht gefunden");
        const data = await res.json();
        setRecord(data);

        // QR-Code generieren (clientseitig)
        const QRCode = await import("qrcode");
        const url = `${window.location.origin}/notfall/${data.accessToken}`;
        const dataUrl = await QRCode.toDataURL(url, {
          width: 400,
          margin: 2,
          color: { dark: "#000000", light: "#ffffff" },
          errorCorrectionLevel: "H",
        });
        setQrDataUrl(dataUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Fehler beim Laden");
      } finally {
        setLoading(false);
      }
    }
    loadRecord();
  }, [editToken]);

  async function handleToggleActive() {
    if (!record) return;
    try {
      const res = await fetch(`/api/records/${editToken}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !record.isActive }),
      });
      if (!res.ok) throw new Error("Fehler");
      const data = await res.json();
      setRecord((prev) => prev ? { ...prev, isActive: data.isActive } : null);
    } catch {
      alert("Fehler beim Aktualisieren des Status");
    }
  }

  async function handleDelete() {
    if (!confirm("Sind Sie sicher, dass Sie diesen Datensatz unwiderruflich löschen möchten?")) return;
    try {
      const res = await fetch(`/api/records/${editToken}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Fehler");
      router.push("/");
    } catch {
      alert("Fehler beim Löschen");
    }
  }

  async function handleDownloadPNG() {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.download = `notfall-qr-${record?.title?.replace(/\s+/g, "-") || "code"}.png`;
    link.href = qrDataUrl;
    link.click();
  }

  async function handleDownloadPDF() {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    // Titel
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("NOTFALLINFORMATIONEN", 105, 25, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Bitte scannen Sie den QR-Code", 105, 35, { align: "center" });

    if (record?.title) {
      doc.setFontSize(14);
      doc.text(record.title, 105, 45, { align: "center" });
    }

    // QR-Code
    if (qrDataUrl) {
      doc.addImage(qrDataUrl, "PNG", 42.5, 55, 60, 60);
    }

    // URL als Text
    doc.setFontSize(8);
    doc.text(viewUrl, 105, 125, { align: "center", maxWidth: 120 });

    // Hinweistext
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    const hinweis = "Dieser QR-Code enthält Notfallinformationen für Einsatzkräfte. " +
      "Er steht in keiner offiziellen Verbindung zu Behörden.";
    doc.text(hinweis, 105, 140, { align: "center", maxWidth: 120 });

    // Schnittlinie für Aufkleber
    doc.setDrawColor(200);
    doc.setLineDashPattern([2, 2], 0);
    doc.rect(30, 15, 85, 135);

    doc.save(`notfall-qr-${record?.title?.replace(/\s+/g, "-") || "code"}.pdf`);
  }

  function handlePrint() {
    window.print();
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
            <p className="text-gray-600">Wird geladen...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !record) {
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Erfolgshinweis */}
          <div className="rounded-lg bg-success-50 border border-success-500 p-4 mb-8 no-print">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-success-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold text-success-600">Ihr Notfalldatensatz wurde erstellt!</p>
                <p className="text-sm text-success-600 mt-1">
                  Speichern Sie diese Seite als Lesezeichen &ndash; über diesen Link können Sie Ihre
                  Daten jederzeit bearbeiten, deaktivieren oder löschen.
                </p>
              </div>
            </div>
          </div>

          {/* Wichtig: Bearbeitungslink sichern */}
          <div className="rounded-lg bg-warning-50 border border-warning-500 p-4 mb-8 no-print">
            <p className="text-sm text-warning-600">
              <strong>Wichtig:</strong> Speichern Sie den aktuellen Link in Ihren Lesezeichen!
              Er ist Ihr Zugang zur Verwaltung dieses Datensatzes. Wenn Sie ihn verlieren,
              können Sie nicht mehr auf die Bearbeitungsfunktionen zugreifen.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* QR-Code Anzeige */}
            <div className="card text-center" ref={qrRef}>
              <div className="print-only text-center mb-4">
                <h2 className="text-xl font-bold">NOTFALLINFORMATIONEN</h2>
                <p className="text-sm text-gray-600">Bitte QR-Code scannen</p>
              </div>

              <h2 className="text-lg font-semibold mb-1 no-print">Ihr QR-Code</h2>
              <p className="text-sm text-gray-600 mb-4 no-print">{record.title}</p>

              {!record.isActive && (
                <div className="bg-emergency-50 border border-emergency-500 rounded-lg p-3 mb-4">
                  <p className="text-sm font-semibold text-emergency-700">QR-Code deaktiviert</p>
                  <p className="text-xs text-emergency-600">Dieser Code ist aktuell nicht abrufbar.</p>
                </div>
              )}

              {qrDataUrl && (
                <div className={`inline-block p-4 bg-white rounded-lg ${!record.isActive ? "opacity-50" : ""}`}>
                  <img src={qrDataUrl} alt="QR-Code" className="w-64 h-64 mx-auto" />
                </div>
              )}

              <p className="mt-4 text-xs text-gray-500 break-all print-only">{viewUrl}</p>

              <p className="mt-2 text-xs text-gray-400 no-print">
                {record.hasPIN ? "PIN-geschützt" : "Ohne PIN-Schutz"} &middot;{" "}
                {record.isActive ? "Aktiv" : "Deaktiviert"}
              </p>

              <p className="mt-4 text-xs text-gray-500 italic print-only">
                Dieser QR-Code enthält Notfallinformationen für Einsatzkräfte.
                Kein offizieller Dienst von Behörden.
              </p>
            </div>

            {/* Aktionen */}
            <div className="space-y-4 no-print">
              <div className="card">
                <h3 className="font-semibold mb-4">QR-Code speichern</h3>
                <div className="space-y-3">
                  <button onClick={handleDownloadPNG} className="btn-secondary w-full flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Als Bild herunterladen (PNG)
                  </button>
                  <button onClick={handleDownloadPDF} className="btn-secondary w-full flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    Als PDF herunterladen
                  </button>
                  <button onClick={handlePrint} className="btn-secondary w-full flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.75 12h.008v.008h-.008V12zm-8.25 0h.008v.008H10.5V12z" />
                    </svg>
                    Drucken
                  </button>
                </div>
              </div>

              <div className="card">
                <h3 className="font-semibold mb-4">Aufkleber bestellen</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Wetterfeste QR-Code-Aufkleber für Ihre Haustür werden in Kürze verfügbar sein.
                </p>
                <button disabled className="btn-secondary w-full opacity-50 cursor-not-allowed">
                  Demnächst verfügbar
                </button>
              </div>

              <div className="card">
                <h3 className="font-semibold mb-4">Datensatz verwalten</h3>
                <div className="space-y-3">
                  <Link
                    href={`/verwalten/${editToken}`}
                    className="btn-secondary w-full flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                    </svg>
                    Daten bearbeiten
                  </Link>
                  <button
                    onClick={handleToggleActive}
                    className={`w-full flex items-center justify-center gap-2 ${
                      record.isActive ? "btn-secondary" : "btn-primary"
                    }`}
                  >
                    {record.isActive ? "QR-Code deaktivieren" : "QR-Code aktivieren"}
                  </button>
                  <button onClick={handleDelete} className="btn-danger w-full">
                    Datensatz löschen
                  </button>
                </div>
              </div>

              {/* Vorschau-Link */}
              <div className="card">
                <h3 className="font-semibold mb-2">Vorschau der Abrufseite</h3>
                <p className="text-sm text-gray-600 mb-3">So sehen Einsatzkräfte Ihre Informationen:</p>
                <Link
                  href={`/notfall/${record.accessToken}`}
                  className="text-primary-600 hover:text-primary-800 text-sm font-medium underline"
                  target="_blank"
                >
                  Abrufseite öffnen &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
