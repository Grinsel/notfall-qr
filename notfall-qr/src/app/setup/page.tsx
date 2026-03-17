"use client";

import { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { encrypt, buildHashUrl } from "@/lib/crypto";
import QRCode from "qrcode";

const SOFT_LIMIT = 800;
const HARD_LIMIT = 1200;

export default function SetupPage() {
  const [text, setText] = useState("");
  const [label, setLabel] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [fullUrl, setFullUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const charCount = text.length;
  const overSoft = charCount > SOFT_LIMIT;
  const overHard = charCount > HARD_LIMIT;

  async function handleGenerate() {
    if (!text.trim()) {
      setError("Bitte geben Sie Ihre Notfallinformationen ein.");
      return;
    }
    if (overHard) {
      setError(`Maximal ${HARD_LIMIT} Zeichen erlaubt.`);
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const { encryptedData, iv, key } = await encrypt(text);
      const baseUrl = window.location.origin;
      const url = buildHashUrl(baseUrl, encryptedData, iv, key);

      if (url.length > 3000) {
        setError("Der Text ist zu lang für einen zuverlässigen QR-Code. Bitte kürzen Sie den Text.");
        setGenerating(false);
        return;
      }

      const dataUrl = await QRCode.toDataURL(url, {
        width: 400,
        margin: 2,
        errorCorrectionLevel: "H",
        color: { dark: "#000000", light: "#ffffff" },
      });

      setQrDataUrl(dataUrl);
      setFullUrl(url);
    } catch {
      setError("Fehler bei der Verschlüsselung. Bitte versuchen Sie es erneut.");
    } finally {
      setGenerating(false);
    }
  }

  function handleDownload() {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.download = label.trim() ? `notfall-qr-${label.trim().toLowerCase().replace(/\s+/g, "-")}.png` : "notfall-qr.png";
    link.href = qrDataUrl;
    link.click();
  }

  function handleReset() {
    setQrDataUrl(null);
    setFullUrl(null);
    setError(null);
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            QR-Code erstellen
          </h1>
          <p className="text-gray-600 mb-8">
            Geben Sie die Informationen ein, die Einsatzkräfte im Notfall sehen sollen.
            Alles wird direkt in Ihrem Browser verschlüsselt und im QR-Code gespeichert &ndash;
            es werden keine Daten an einen Server gesendet.
          </p>

          {!qrDataUrl ? (
            <>
              {/* Warning */}
              <div className="rounded-lg bg-warning-50 border border-warning-500 p-4 mb-6">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-warning-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  <div className="text-sm text-warning-600">
                    <strong>Wichtig:</strong> Dieser QR-Code enthält Ihre Daten. Jede Person, die ihn scannt,
                    kann die Informationen lesen. Geben Sie nur ein, was Einsatzkräfte wissen sollen.
                    Keine Passwörter, PINs oder Finanzdaten.
                  </div>
                </div>
              </div>

              {/* Label */}
              <div className="mb-4">
                <label htmlFor="label" className="label-text">
                  Bezeichnung (optional, nur für Sie)
                </label>
                <input
                  id="label"
                  type="text"
                  className="input-field"
                  placeholder="z.B. Wohnung Hauptstraße 5"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  maxLength={100}
                />
              </div>

              {/* Main text */}
              <div className="mb-4">
                <label htmlFor="emergency-text" className="label-text">
                  Notfallinformationen *
                </label>
                <textarea
                  id="emergency-text"
                  className="input-field min-h-[200px] resize-y"
                  placeholder={`Beispiel:\n\nErsatzschlüssel bei Nachbarin Frau Meyer, Wohnung 12.\nBlutgruppe: A+\nAllergien: Penicillin\nGas-Absperrhahn: Keller links neben dem Zähler\nSicherungskasten: Flur, oberer Schrank\nWasser-Haupthahn: Keller rechts\nHaustiere: 1 Katze (scheu, versteckt sich unter dem Bett)\nNotfallkontakt: Maria Müller, 0171-1234567`}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  maxLength={HARD_LIMIT}
                />
                <div className="flex justify-between items-center mt-1.5">
                  <span className={`text-xs ${overHard ? "text-emergency-600 font-semibold" : overSoft ? "text-warning-600" : "text-gray-400"}`}>
                    {overSoft && !overHard && "QR-Code wird groß — kürzer ist besser"}
                    {overHard && "Maximale Zeichenzahl erreicht"}
                  </span>
                  <span className={`text-xs ${overHard ? "text-emergency-600 font-semibold" : overSoft ? "text-warning-600" : "text-gray-400"}`}>
                    {charCount}/{HARD_LIMIT}
                  </span>
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-emergency-50 border border-emergency-500 p-3 mb-4 text-sm text-emergency-700">
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={generating || !text.trim() || overHard}
                className="btn-primary w-full py-3 text-base"
              >
                {generating ? "Wird verschlüsselt..." : "QR-Code generieren"}
              </button>
            </>
          ) : (
            /* Result */
            <div className="text-center">
              <div className="card inline-block p-8 mb-6">
                {label && (
                  <p className="text-sm text-gray-500 mb-4">{label}</p>
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrDataUrl}
                  alt="Notfall-QR-Code"
                  className="w-64 h-64 sm:w-80 sm:h-80 mx-auto"
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
                <button onClick={handleDownload} className="btn-primary px-8 py-3 text-base">
                  Als PNG herunterladen
                </button>
                <button onClick={() => window.print()} className="btn-secondary px-8 py-3 text-base">
                  Drucken
                </button>
              </div>

              <div className="card text-left mb-6">
                <h3 className="font-semibold text-sm mb-2">So geht es weiter:</h3>
                <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                  <li>Laden Sie den QR-Code herunter oder drucken Sie ihn aus</li>
                  <li>Bringen Sie ihn sichtbar an Ihrer Haustür an</li>
                  <li>Fertig &ndash; im Notfall scannen Einsatzkräfte den Code</li>
                </ol>
              </div>

              <div className="rounded-lg bg-primary-50 border border-primary-200 p-4 mb-6 text-sm text-left">
                <strong>Hinweis:</strong> Ihre Daten sind ausschließlich in diesem QR-Code gespeichert.
                Es gibt keine Kopie auf einem Server. Wenn Sie den QR-Code verlieren, müssen Sie einen neuen erstellen.
              </div>

              {fullUrl && (
                <details className="card text-left mb-6">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700">
                    Vorschau: So sieht es beim Scannen aus
                  </summary>
                  <div className="mt-3">
                    <a
                      href={fullUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline text-sm break-all"
                    >
                      Link öffnen
                    </a>
                  </div>
                </details>
              )}

              <button onClick={handleReset} className="text-sm text-gray-500 hover:text-gray-700 underline">
                Neuen QR-Code erstellen
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
