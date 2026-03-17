"use client";

import { useState, useMemo, useRef } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { encrypt, buildHashUrl } from "@/lib/crypto";
import {
  EmergencyData,
  createEmptyEmergencyData,
  serializeEmergencyData,
  isEmergencyDataEmpty,
} from "@/lib/emergency-data";
import { renderQrWithFrame } from "@/lib/qr-frame";
import QRCode from "qrcode";

const SOFT_LIMIT = 800;
const HARD_LIMIT = 1200;
const MAX_CONTACTS = 3;

const BLOOD_TYPES = ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "0+", "0-"];
const GENDERS = ["", "Maennlich", "Weiblich", "Divers"];
const ORGAN_DONOR_OPTIONS = ["", "Ja", "Nein", "Unbekannt"];
const JA_NEIN_OPTIONS = ["", "Ja", "Nein"];
const HEATING_TYPES = ["Gas", "Oel", "Fernwaerme", "Waermepumpe", "Pellets", "Strom"];

export default function SetupPage() {
  const [data, setData] = useState<EmergencyData>(createEmptyEmergencyData());
  const [label, setLabel] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [framedDataUrl, setFramedDataUrl] = useState<string | null>(null);
  const [fullUrl, setFullUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const hasNotfalldose = data.emergencyBox === "Ja";

  const NOTFALLDOSE_HIDDEN_FIELDS: (keyof EmergencyData)[] = [
    "birthdate", "gender", "bloodType",
    "conditions", "allergies", "medications", "implants", "familyDoctor",
    "organDonor", "livingWill", "insurance",
  ];

  function toggleNotfalldose(checked: boolean) {
    setData((prev) => {
      const next = { ...prev, emergencyBox: checked ? "Ja" : "" };
      if (checked) {
        for (const field of NOTFALLDOSE_HIDDEN_FIELDS) {
          (next as Record<string, unknown>)[field] = "";
        }
        next.contacts = [{ name: "", phone: "" }];
      }
      return next;
    });
  }

  const serialized = useMemo(() => serializeEmergencyData(data), [data]);
  const charCount = serialized.length;
  const overSoft = charCount > SOFT_LIMIT;
  const overHard = charCount > HARD_LIMIT;
  const isEmpty = isEmergencyDataEmpty(data);

  function updateField<K extends keyof EmergencyData>(key: K, value: EmergencyData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function updateContact(index: number, field: "name" | "phone", value: string) {
    setData((prev) => {
      const contacts = [...prev.contacts];
      contacts[index] = { ...contacts[index], [field]: value };
      return { ...prev, contacts };
    });
  }

  function addContact() {
    if (data.contacts.length >= MAX_CONTACTS) return;
    setData((prev) => ({
      ...prev,
      contacts: [...prev.contacts, { name: "", phone: "" }],
    }));
  }

  function removeContact(index: number) {
    if (data.contacts.length <= 1) return;
    setData((prev) => ({
      ...prev,
      contacts: prev.contacts.filter((_, i) => i !== index),
    }));
  }

  async function handleGenerate() {
    if (isEmpty) {
      setError("Bitte fuellen Sie mindestens ein Feld aus.");
      return;
    }
    if (overHard) {
      setError(`Maximal ${HARD_LIMIT} Zeichen erlaubt.`);
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const { encryptedData, iv, key } = await encrypt(serialized);
      const baseUrl = window.location.origin;
      const url = buildHashUrl(baseUrl, encryptedData, iv, key);

      if (url.length > 3000) {
        setError(
          "Die Daten sind zu umfangreich fuer einen zuverlaessigen QR-Code. Bitte kuerzen Sie einzelne Felder."
        );
        setGenerating(false);
        return;
      }

      const dataUrl = await QRCode.toDataURL(url, {
        width: 400,
        margin: 2,
        errorCorrectionLevel: "H",
        color: { dark: "#000000", light: "#ffffff" },
      });

      const framed = await renderQrWithFrame(dataUrl);
      setQrDataUrl(dataUrl);
      setFramedDataUrl(framed);
      setFullUrl(url);
    } catch {
      setError("Fehler bei der Verschluesselung. Bitte versuchen Sie es erneut.");
    } finally {
      setGenerating(false);
    }
  }

  function handleDownload() {
    if (!framedDataUrl) return;
    const link = document.createElement("a");
    link.download = label.trim()
      ? `notfall-qr-${label.trim().toLowerCase().replace(/\s+/g, "-")}.png`
      : "notfall-qr.png";
    link.href = framedDataUrl;
    link.click();
  }

  function handleReset() {
    setData(createEmptyEmergencyData());
    setLabel("");
    setQrDataUrl(null);
    setFramedDataUrl(null);
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
            Geben Sie die Informationen ein, die Einsatzkraefte im Notfall sehen sollen. Alle
            Felder sind optional. Die Daten werden direkt in Ihrem Browser verschluesselt und im
            QR-Code gespeichert &ndash; es werden keine Daten an einen Server gesendet.
          </p>

          {!qrDataUrl ? (
            <>
              {/* Warning */}
              <div className="rounded-lg bg-warning-50 border border-warning-500 p-4 mb-6">
                <div className="flex gap-3">
                  <svg
                    className="w-5 h-5 text-warning-600 mt-0.5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                  <div className="text-sm text-warning-600">
                    <strong>Wichtig:</strong> Dieser QR-Code enthaelt Ihre Daten. Jede Person, die
                    ihn scannt, kann die Informationen lesen. Geben Sie nur ein, was Einsatzkraefte
                    wissen sollen. Keine Passwoerter, PINs oder Finanzdaten.
                  </div>
                </div>
              </div>

              {/* Notfalldose Info-Box */}
              <div className="rounded-lg border-2 border-primary-600 bg-primary-50 p-4 mb-6">
                <h3 className="text-base font-semibold text-primary-800 mb-2">
                  Haben Sie eine Notfalldose?
                </h3>
                <p className="text-sm text-primary-700 mb-3">
                  Die Notfalldose (SOS-Dose / Rotkreuzdose) ist ein Behaelter im Kuehlschrank, der
                  alle wichtigen medizinischen Daten auf Papier enthaelt. Rettungskraefte wissen, wo
                  sie suchen muessen. Wenn Sie eine Notfalldose haben, werden medizinische Felder
                  hier ausgeblendet &ndash; die Daten stehen bereits in Ihrer Dose.
                </p>
                <p className="text-sm text-primary-700 mb-3">
                  Mehr Infos:{" "}
                  <a
                    href="https://notfalldose.de"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-medium text-primary-800 hover:text-primary-900"
                  >
                    notfalldose.de
                  </a>
                </p>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasNotfalldose}
                    onChange={(e) => toggleNotfalldose(e.target.checked)}
                    className="w-5 h-5 rounded border-primary-600 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-primary-800">
                    Ja, ich habe eine Notfalldose im Kuehlschrank
                  </span>
                </label>
              </div>

              {/* Label */}
              <div className="mb-6">
                <label htmlFor="label" className="label-text">
                  Bezeichnung (optional, nur fuer Sie)
                </label>
                <input
                  id="label"
                  type="text"
                  className="input-field"
                  placeholder="z.B. Wohnung Hauptstrasse 5"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  maxLength={100}
                />
              </div>

              {/* Section: Persoenliche Daten */}
              <div className="card mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Persoenliche Daten
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="ed-name" className="label-text">
                      Name / Alias
                    </label>
                    <input
                      id="ed-name"
                      type="text"
                      className="input-field"
                      placeholder="z.B. Max M."
                      value={data.name}
                      onChange={(e) => updateField("name", e.target.value)}
                    />
                  </div>
                  {!hasNotfalldose && (
                    <>
                      <div>
                        <label htmlFor="ed-birthdate" className="label-text">
                          Geburtsdatum
                        </label>
                        <input
                          id="ed-birthdate"
                          type="text"
                          className="input-field"
                          placeholder="TT.MM.JJJJ"
                          value={data.birthdate}
                          onChange={(e) => updateField("birthdate", e.target.value)}
                        />
                      </div>
                      <div>
                        <label htmlFor="ed-gender" className="label-text">
                          Geschlecht
                        </label>
                        <select
                          id="ed-gender"
                          className="input-field"
                          value={data.gender}
                          onChange={(e) => updateField("gender", e.target.value)}
                        >
                          {GENDERS.map((g) => (
                            <option key={g} value={g}>
                              {g || "– Bitte waehlen –"}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="ed-blood" className="label-text">
                          Blutgruppe
                        </label>
                        <select
                          id="ed-blood"
                          className="input-field"
                          value={data.bloodType}
                          onChange={(e) => updateField("bloodType", e.target.value)}
                        >
                          {BLOOD_TYPES.map((b) => (
                            <option key={b} value={b}>
                              {b || "– Bitte waehlen –"}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Section: Wohnung / Gebaeude */}
              <div className="card mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Wohnung / Gebaeude
                </h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="ed-sparekey" className="label-text">
                      Ersatzschluessel
                    </label>
                    <textarea
                      id="ed-sparekey"
                      className="input-field min-h-[60px] resize-y"
                      placeholder="z.B. Ja, bei Nachbarin Frau M., Wohnung 12"
                      value={data.spareKey}
                      onChange={(e) => updateField("spareKey", e.target.value)}
                    />
                  </div>
                  {data.spareKey.trim() && (
                    <div>
                      <label htmlFor="ed-sparekeyloc" className="label-text">
                        Ersatzschluessel-Ort
                      </label>
                      <input
                        id="ed-sparekeyloc"
                        type="text"
                        className="input-field"
                        placeholder="z.B. Schluesseltresor an der Hauswand, Nachbarin Frau M. Wohnung 12"
                        value={data.spareKeyLocation}
                        onChange={(e) => updateField("spareKeyLocation", e.target.value)}
                      />
                    </div>
                  )}
                  <div>
                    <span className="label-text">Heizungsart</span>
                    <div className="flex flex-wrap gap-3 mt-1">
                      {HEATING_TYPES.map((h) => (
                        <label key={h} className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={data.heatingType.includes(h)}
                            onChange={(e) => {
                              const next = e.target.checked
                                ? [...data.heatingType, h]
                                : data.heatingType.filter((t) => t !== h);
                              updateField("heatingType", next);
                            }}
                            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700">{h}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {data.heatingType.length > 0 && (
                    <div>
                      <label htmlFor="ed-heatingshutoff" className="label-text">
                        Absperrhahn Standort
                      </label>
                      <input
                        id="ed-heatingshutoff"
                        type="text"
                        className="input-field"
                        placeholder="z.B. Keller links neben Zaehler"
                        value={data.heatingShutoff}
                        onChange={(e) => updateField("heatingShutoff", e.target.value)}
                      />
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="ed-solar" className="label-text">
                        Photovoltaik
                      </label>
                      <select
                        id="ed-solar"
                        className="input-field"
                        value={data.solarSystem}
                        onChange={(e) => updateField("solarSystem", e.target.value)}
                      >
                        {JA_NEIN_OPTIONS.map((o) => (
                          <option key={o} value={o}>
                            {o || "– Bitte waehlen –"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {data.solarSystem === "Ja" && (
                    <div>
                      <label htmlFor="ed-solarshutoff" className="label-text">
                        Hauptsicherung Photovoltaik
                      </label>
                      <input
                        id="ed-solarshutoff"
                        type="text"
                        className="input-field"
                        placeholder="z.B. Hauptsicherung im Keller rechts"
                        value={data.solarShutoff}
                        onChange={(e) => updateField("solarShutoff", e.target.value)}
                      />
                    </div>
                  )}
                  <div>
                    <label htmlFor="ed-pets" className="label-text">
                      Haustiere
                    </label>
                    <input
                      id="ed-pets"
                      type="text"
                      className="input-field"
                      placeholder="z.B. 1 Katze (scheu), 1 Hund"
                      value={data.pets}
                      onChange={(e) => updateField("pets", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Section: Medizinische Daten */}
              {!hasNotfalldose && (
                <div className="card mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Medizinische Daten
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="ed-conditions" className="label-text">
                        Vorerkrankungen
                      </label>
                      <textarea
                        id="ed-conditions"
                        className="input-field min-h-[60px] resize-y"
                        placeholder="z.B. Diabetes Typ 2, Asthma"
                        value={data.conditions}
                        onChange={(e) => updateField("conditions", e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="ed-allergies" className="label-text">
                        Allergien
                      </label>
                      <textarea
                        id="ed-allergies"
                        className="input-field min-h-[60px] resize-y"
                        placeholder="z.B. Penicillin, Latex"
                        value={data.allergies}
                        onChange={(e) => updateField("allergies", e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="ed-medications" className="label-text">
                        Medikamente
                      </label>
                      <textarea
                        id="ed-medications"
                        className="input-field min-h-[60px] resize-y"
                        placeholder="z.B. Metformin 500mg, Salbutamol"
                        value={data.medications}
                        onChange={(e) => updateField("medications", e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="ed-implants" className="label-text">
                        Implantate
                      </label>
                      <input
                        id="ed-implants"
                        type="text"
                        className="input-field"
                        placeholder="z.B. Herzschrittmacher, Knieprothese"
                        value={data.implants}
                        onChange={(e) => updateField("implants", e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="ed-doctor" className="label-text">
                        Hausarzt / Hausaerztin
                      </label>
                      <input
                        id="ed-doctor"
                        type="text"
                        className="input-field"
                        placeholder="z.B. Praxis Dr. Schmidt, Hauptstr. 10"
                        value={data.familyDoctor}
                        onChange={(e) => updateField("familyDoctor", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Section: Notfallkontakte */}
              {!hasNotfalldose && (
                <div className="card mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Notfallkontakte
                  </h2>
                  <div className="space-y-4">
                    {data.contacts.map((contact, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label htmlFor={`contact-name-${i}`} className="label-text">
                              Name
                            </label>
                            <input
                              id={`contact-name-${i}`}
                              type="text"
                              className="input-field"
                              placeholder="z.B. Maria M."
                              value={contact.name}
                              onChange={(e) => updateContact(i, "name", e.target.value)}
                            />
                          </div>
                          <div>
                            <label htmlFor={`contact-phone-${i}`} className="label-text">
                              Telefon
                            </label>
                            <input
                              id={`contact-phone-${i}`}
                              type="tel"
                              className="input-field"
                              placeholder="+49 123 456789"
                              value={contact.phone}
                              onChange={(e) => updateContact(i, "phone", e.target.value)}
                            />
                          </div>
                        </div>
                        {data.contacts.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeContact(i)}
                            className="mt-6 p-2 text-gray-400 hover:text-emergency-600 transition-colors"
                            aria-label="Kontakt entfernen"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                    {data.contacts.length < MAX_CONTACTS && (
                      <button
                        type="button"
                        onClick={addContact}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                      >
                        + Kontakt hinzufuegen
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Section: Sonstiges */}
              <div className="card mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Sonstiges</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {!hasNotfalldose && (
                    <>
                      <div>
                        <label htmlFor="ed-organ" className="label-text">
                          Organspender
                        </label>
                        <select
                          id="ed-organ"
                          className="input-field"
                          value={data.organDonor}
                          onChange={(e) => updateField("organDonor", e.target.value)}
                        >
                          {ORGAN_DONOR_OPTIONS.map((o) => (
                            <option key={o} value={o}>
                              {o || "– Bitte waehlen –"}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="ed-will" className="label-text">
                          Patientenverfuegung
                        </label>
                        <input
                          id="ed-will"
                          type="text"
                          className="input-field"
                          placeholder="z.B. Ja, beim Hausarzt hinterlegt"
                          value={data.livingWill}
                          onChange={(e) => updateField("livingWill", e.target.value)}
                        />
                      </div>
                      <div>
                        <label htmlFor="ed-insurance" className="label-text">
                          Krankenkasse
                        </label>
                        <input
                          id="ed-insurance"
                          type="text"
                          className="input-field"
                          placeholder="z.B. AOK Bayern"
                          value={data.insurance}
                          onChange={(e) => updateField("insurance", e.target.value)}
                        />
                      </div>
                    </>
                  )}
                  <div className="sm:col-span-2">
                    <label htmlFor="ed-notes" className="label-text">
                      Besondere Hinweise
                    </label>
                    <textarea
                      id="ed-notes"
                      className="input-field min-h-[60px] resize-y"
                      placeholder="z.B. Rollstuhlfahrer, gehoerlos, Demenz, bettlaegerig, Sauerstoffgeraet, 2. Schluessel bei Nachbar Mueller Hausnummer 4"
                      value={data.notes}
                      onChange={(e) => updateField("notes", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Character count */}
              <div className="flex justify-between items-center mb-4">
                <span
                  className={`text-xs ${
                    overHard
                      ? "text-emergency-600 font-semibold"
                      : overSoft
                      ? "text-warning-600"
                      : "text-gray-400"
                  }`}
                >
                  {overSoft && !overHard && "QR-Code wird gross — kuerzer ist besser"}
                  {overHard && "Maximale Zeichenzahl erreicht"}
                </span>
                <span
                  className={`text-xs ${
                    overHard
                      ? "text-emergency-600 font-semibold"
                      : overSoft
                      ? "text-warning-600"
                      : "text-gray-400"
                  }`}
                >
                  {charCount}/{HARD_LIMIT}
                </span>
              </div>

              {error && (
                <div className="rounded-lg bg-emergency-50 border border-emergency-500 p-3 mb-4 text-sm text-emergency-700">
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={generating || isEmpty || overHard}
                className="btn-primary w-full py-3 text-base"
              >
                {generating ? "Wird verschluesselt..." : "QR-Code generieren"}
              </button>
            </>
          ) : (
            /* Result */
            <div className="text-center">
              <div className="card inline-block p-8 mb-6">
                {label && <p className="text-sm text-gray-500 mb-4">{label}</p>}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={framedDataUrl || qrDataUrl}
                  alt="Notfall-QR-Code"
                  className="w-72 h-72 sm:w-96 sm:h-96 mx-auto"
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
                <button onClick={handleDownload} className="btn-primary px-8 py-3 text-base">
                  Als PNG herunterladen
                </button>
                <button
                  onClick={() => window.print()}
                  className="btn-secondary px-8 py-3 text-base"
                >
                  Drucken
                </button>
              </div>

              <div className="card text-left mb-6">
                <h3 className="font-semibold text-sm mb-2">So geht es weiter:</h3>
                <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                  <li>Laden Sie den QR-Code herunter oder drucken Sie ihn aus</li>
                  <li>Bringen Sie ihn sichtbar an Ihrer Haustuer an</li>
                  <li>Fertig &ndash; im Notfall scannen Einsatzkraefte den Code</li>
                </ol>
              </div>

              <div className="rounded-lg bg-primary-50 border border-primary-200 p-4 mb-6 text-sm text-left">
                <strong>Hinweis:</strong> Ihre Daten sind ausschliesslich in diesem QR-Code
                gespeichert. Es gibt keine Kopie auf einem Server. Wenn Sie den QR-Code verlieren,
                muessen Sie einen neuen erstellen.
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
                      Link oeffnen
                    </a>
                  </div>
                </details>
              )}

              <button
                onClick={handleReset}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
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
