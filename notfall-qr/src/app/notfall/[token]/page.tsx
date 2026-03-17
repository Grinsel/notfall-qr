"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface EmergencyData {
  title: string;
  requiresPin?: boolean;
  isActive: boolean;
  accessInfo?: string;
  gasShutoff?: string;
  electricPanel?: string;
  waterShutoff?: string;
  additionalNotes?: string;
  contactPerson?: string;
  pets?: string;
}

export default function NotfallPage() {
  const params = useParams();
  const token = params.token as string;
  const [data, setData] = useState<EmergencyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPinForm, setShowPinForm] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [pinLoading, setPinLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/view/${token}`);
        if (res.status === 429) {
          setError("Zu viele Anfragen. Bitte versuchen Sie es in einer Minute erneut.");
          return;
        }
        if (res.status === 410) {
          const d = await res.json();
          setData({ title: d.title, isActive: false });
          return;
        }
        if (!res.ok) {
          setError("Dieser Notfalldatensatz wurde nicht gefunden oder ist nicht mehr gültig.");
          return;
        }
        const d = await res.json();
        setData(d);
        if (d.requiresPin) {
          setShowPinForm(true);
        }
      } catch {
        setError("Fehler beim Laden der Daten. Bitte prüfen Sie Ihre Internetverbindung.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [token]);

  async function handlePinSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPinLoading(true);
    setPinError("");
    try {
      const res = await fetch(`/api/view/${token}/verify-pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      if (res.status === 429) {
        setPinError("Zu viele Versuche. Bitte warten Sie.");
        return;
      }
      if (res.status === 403) {
        setPinError("Falsche PIN. Bitte versuchen Sie es erneut.");
        return;
      }
      if (!res.ok) {
        setPinError("Fehler bei der Überprüfung.");
        return;
      }
      const d = await res.json();
      setData(d);
      setShowPinForm(false);
    } catch {
      setPinError("Verbindungsfehler. Bitte erneut versuchen.");
    } finally {
      setPinLoading(false);
    }
  }

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-emergency-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emergency-600 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-700">Notfalldaten werden geladen...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-emergency-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emergency-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Nicht verfügbar</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // Deaktiviert
  if (data && !data.isActive) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Deaktiviert</h1>
          <p className="text-gray-600">
            Dieser Notfalldatensatz{data.title ? ` (${data.title})` : ""} wurde vom Eigentümer deaktiviert.
          </p>
        </div>
      </div>
    );
  }

  // PIN-Eingabe
  if (showPinForm) {
    return (
      <div className="min-h-screen bg-emergency-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="bg-emergency-600 text-white rounded-t-2xl p-6 text-center">
            <div className="text-4xl mb-2">🚨</div>
            <h1 className="text-2xl font-bold">NOTFALLINFORMATIONEN</h1>
            <p className="text-emergency-100 mt-1">{data?.title}</p>
          </div>

          <div className="bg-white rounded-b-2xl shadow-xl p-6">
            <p className="text-center text-gray-600 mb-6">
              Dieser Datensatz ist PIN-geschützt.<br />
              Bitte geben Sie die PIN ein, um die Details anzuzeigen.
            </p>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <input
                type="text"
                inputMode="numeric"
                pattern="\d{4,6}"
                className="input-field text-center text-2xl tracking-[0.5em] font-mono"
                placeholder="PIN"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value.replace(/\D/g, "").slice(0, 6));
                  setPinError("");
                }}
                autoFocus
                maxLength={6}
              />
              {pinError && (
                <p className="text-sm text-emergency-600 text-center">{pinError}</p>
              )}
              <button
                type="submit"
                disabled={pin.length < 4 || pinLoading}
                className="btn-primary w-full text-lg py-3"
              >
                {pinLoading ? "Wird geprüft..." : "Anzeigen"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Notfalldaten Anzeige – optimiert für schnelles Erfassen
  return (
    <div className="min-h-screen bg-emergency-50">
      {/* Emergency Header */}
      <div className="bg-emergency-600 text-white p-4 sm:p-6 text-center">
        <div className="text-3xl sm:text-4xl mb-1">🚨</div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-wide">NOTFALLINFORMATIONEN</h1>
        <p className="text-emergency-100 text-sm sm:text-base mt-1">{data?.title}</p>
      </div>

      <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-4">
        {/* Zugang */}
        {data?.accessInfo && (
          <InfoCard
            icon="🔑"
            label="ZUGANG / SCHLÜSSEL"
            value={data.accessInfo}
            priority
          />
        )}

        {/* Absperrhähne und Sicherungskasten */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {data?.gasShutoff && (
            <InfoCard icon="🔥" label="GAS-ABSPERRHAHN" value={data.gasShutoff} />
          )}
          {data?.electricPanel && (
            <InfoCard icon="⚡" label="SICHERUNGSKASTEN" value={data.electricPanel} />
          )}
          {data?.waterShutoff && (
            <InfoCard icon="💧" label="WASSER-HAUPTHAHN" value={data.waterShutoff} />
          )}
        </div>

        {/* Haustiere – wichtig für Rettung! */}
        {data?.pets && (
          <InfoCard icon="🐾" label="HAUSTIERE" value={data.pets} priority />
        )}

        {/* Kontaktperson */}
        {data?.contactPerson && (
          <InfoCard icon="📞" label="KONTAKTPERSON" value={data.contactPerson} />
        )}

        {/* Weitere Hinweise */}
        {data?.additionalNotes && (
          <InfoCard icon="📋" label="WEITERE HINWEISE" value={data.additionalNotes} />
        )}

        {/* Disclaimer */}
        <div className="text-center text-xs text-gray-400 pt-4 pb-8">
          <p>
            Kein offizieller Dienst. Alle Angaben ohne Gewähr.
            <br />
            Bereitgestellt über Notfall-QR.
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
  priority = false,
}: {
  icon: string;
  label: string;
  value: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-4 sm:p-5 ${
        priority
          ? "bg-white ring-2 ring-emergency-500 shadow-lg"
          : "bg-white ring-1 ring-gray-200 shadow-sm"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{icon}</span>
        <h2 className={`text-xs font-bold tracking-wider ${priority ? "text-emergency-700" : "text-gray-500"}`}>
          {label}
        </h2>
      </div>
      <p className={`${priority ? "text-base sm:text-lg" : "text-sm sm:text-base"} text-gray-900 whitespace-pre-line`}>
        {value}
      </p>
    </div>
  );
}
