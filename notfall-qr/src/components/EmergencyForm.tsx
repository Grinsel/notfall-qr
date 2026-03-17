"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface FormData {
  title: string;
  accessInfo: string;
  gasShutoff: string;
  electricPanel: string;
  waterShutoff: string;
  additionalNotes: string;
  contactPerson: string;
  pets: string;
  pin: string;
  email: string;
}

interface EmergencyFormProps {
  initialData?: FormData & { editToken?: string };
  mode?: "create" | "edit";
}

const defaultData: FormData = {
  title: "",
  accessInfo: "",
  gasShutoff: "",
  electricPanel: "",
  waterShutoff: "",
  additionalNotes: "",
  contactPerson: "",
  pets: "",
  pin: "",
  email: "",
};

export function EmergencyForm({ initialData, mode = "create" }: EmergencyFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(initialData || defaultData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOptional, setShowOptional] = useState(
    !!(initialData?.contactPerson || initialData?.pets || initialData?.pin || initialData?.email)
  );

  function updateField(field: keyof FormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!formData.title || formData.title.length < 2) {
      newErrors.title = "Bitte geben Sie eine Bezeichnung ein (mind. 2 Zeichen)";
    }
    if (formData.title.length > 100) {
      newErrors.title = "Maximal 100 Zeichen";
    }
    if (formData.pin && !/^\d{4,6}$/.test(formData.pin)) {
      newErrors.pin = "PIN muss aus 4-6 Ziffern bestehen";
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Bitte geben Sie eine gültige E-Mail-Adresse ein";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const url =
        mode === "edit" && initialData?.editToken
          ? `/api/records/${initialData.editToken}`
          : "/api/records";
      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Fehler beim Speichern");
      }

      const data = await res.json();

      if (mode === "create") {
        router.push(`/qr/${data.editToken}`);
      } else {
        router.push(`/qr/${initialData?.editToken}`);
      }
    } catch (err) {
      setErrors({
        submit: err instanceof Error ? err.message : "Unbekannter Fehler",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Sicherheitshinweis */}
      <div className="rounded-lg bg-warning-50 border border-warning-500 p-4">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-warning-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-warning-600">
            <p className="font-semibold mb-1">Sicherheitshinweis</p>
            <p>
              Die hier eingegebenen Informationen werden über einen QR-Code an Ihrer Haustür
              zugänglich gemacht. Geben Sie <strong>keine hochsensiblen Daten</strong> ein
              (z.&nbsp;B. keine Alarmcodes, Tresorpasswörter oder Wertgegenstände-Standorte).
              Jede Person, die den QR-Code scannt, kann die Informationen ggf. lesen.
            </p>
            <p className="mt-1">
              Nutzen Sie optional einen PIN-Schutz, um den Zugriff einzuschränken.
            </p>
          </div>
        </div>
      </div>

      {errors.submit && (
        <div className="rounded-lg bg-emergency-50 border border-emergency-500 p-4 text-sm text-emergency-700">
          {errors.submit}
        </div>
      )}

      {/* Pflichtfeld: Titel */}
      <div>
        <label htmlFor="title" className="label-text">
          Bezeichnung des Objekts <span className="text-emergency-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          className="input-field"
          placeholder="z. B. Wohnung Familie Müller, 2. OG links"
          value={formData.title}
          onChange={(e) => updateField("title", e.target.value)}
          maxLength={100}
          required
        />
        {errors.title && <p className="mt-1 text-sm text-emergency-600">{errors.title}</p>}
        <p className="mt-1 text-xs text-gray-500">
          Dieser Titel ist öffentlich sichtbar, auch ohne PIN.
        </p>
      </div>

      {/* Notfall-Informationen */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 w-full">
          Notfallinformationen
        </legend>

        <div>
          <label htmlFor="accessInfo" className="label-text">
            Zugangshinweise / Schlüssel
          </label>
          <textarea
            id="accessInfo"
            className="input-field"
            rows={3}
            placeholder="z. B. Ersatzschlüssel beim Nachbarn, Hausnr. 4, Familie Schmidt, 1. OG"
            value={formData.accessInfo}
            onChange={(e) => updateField("accessInfo", e.target.value)}
            maxLength={500}
          />
          <p className="mt-1 text-xs text-gray-500">{formData.accessInfo.length}/500 Zeichen</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="gasShutoff" className="label-text flex items-center gap-1.5">
              <span className="text-lg">🔥</span> Gas-Absperrhahn
            </label>
            <textarea
              id="gasShutoff"
              className="input-field"
              rows={2}
              placeholder="z. B. Keller, rechts neben dem Heizungsraum"
              value={formData.gasShutoff}
              onChange={(e) => updateField("gasShutoff", e.target.value)}
              maxLength={300}
            />
          </div>

          <div>
            <label htmlFor="electricPanel" className="label-text flex items-center gap-1.5">
              <span className="text-lg">⚡</span> Sicherungskasten
            </label>
            <textarea
              id="electricPanel"
              className="input-field"
              rows={2}
              placeholder="z. B. Flur, hinter der Garderobe"
              value={formData.electricPanel}
              onChange={(e) => updateField("electricPanel", e.target.value)}
              maxLength={300}
            />
          </div>

          <div>
            <label htmlFor="waterShutoff" className="label-text flex items-center gap-1.5">
              <span className="text-lg">💧</span> Wasser-Haupthahn
            </label>
            <textarea
              id="waterShutoff"
              className="input-field"
              rows={2}
              placeholder="z. B. Keller, neben der Waschmaschine"
              value={formData.waterShutoff}
              onChange={(e) => updateField("waterShutoff", e.target.value)}
              maxLength={300}
            />
          </div>
        </div>

        <div>
          <label htmlFor="additionalNotes" className="label-text">
            Weitere Hinweise
          </label>
          <textarea
            id="additionalNotes"
            className="input-field"
            rows={3}
            placeholder="z. B. Dachboden nur über Leiter erreichbar, besondere Gefahrstoffe im Keller"
            value={formData.additionalNotes}
            onChange={(e) => updateField("additionalNotes", e.target.value)}
            maxLength={1000}
          />
          <p className="mt-1 text-xs text-gray-500">{formData.additionalNotes.length}/1000 Zeichen</p>
        </div>
      </fieldset>

      {/* Optionale Felder */}
      <div>
        <button
          type="button"
          className="text-sm text-primary-600 hover:text-primary-800 font-medium flex items-center gap-1"
          onClick={() => setShowOptional(!showOptional)}
        >
          <svg
            className={`w-4 h-4 transition-transform ${showOptional ? "rotate-90" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          Optionale Angaben {showOptional ? "ausblenden" : "anzeigen"}
        </button>

        {showOptional && (
          <div className="mt-4 space-y-4 pl-2 border-l-2 border-primary-100">
            <div>
              <label htmlFor="contactPerson" className="label-text">
                Kontaktperson im Notfall
              </label>
              <input
                id="contactPerson"
                type="text"
                className="input-field"
                placeholder="z. B. Max Mustermann, Tel. 0171-1234567"
                value={formData.contactPerson}
                onChange={(e) => updateField("contactPerson", e.target.value)}
                maxLength={200}
              />
            </div>

            <div>
              <label htmlFor="pets" className="label-text">
                Haustiere in der Wohnung
              </label>
              <input
                id="pets"
                type="text"
                className="input-field"
                placeholder="z. B. 1 Hund (Golden Retriever), 2 Katzen"
                value={formData.pets}
                onChange={(e) => updateField("pets", e.target.value)}
                maxLength={300}
              />
            </div>

            <div>
              <label htmlFor="pin" className="label-text">
                PIN-Schutz (optional)
              </label>
              <input
                id="pin"
                type="text"
                inputMode="numeric"
                pattern="\d{4,6}"
                className="input-field max-w-[200px]"
                placeholder="4-6 Ziffern"
                value={formData.pin}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                  updateField("pin", val);
                }}
                maxLength={6}
              />
              {errors.pin && <p className="mt-1 text-sm text-emergency-600">{errors.pin}</p>}
              <p className="mt-1 text-xs text-gray-500">
                Wenn gesetzt, müssen Abrufende diese PIN eingeben, um die Details zu sehen.
                {mode === "edit" && " Leer lassen, um den bestehenden PIN beizubehalten."}
              </p>
            </div>

            <div>
              <label htmlFor="email" className="label-text">
                E-Mail-Adresse (optional)
              </label>
              <input
                id="email"
                type="email"
                className="input-field"
                placeholder="ihre@email.de"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
              {errors.email && <p className="mt-1 text-sm text-emergency-600">{errors.email}</p>}
              <p className="mt-1 text-xs text-gray-500">
                Für die Wiederherstellung des Bearbeitungszugangs. Wird nicht öffentlich angezeigt.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="pt-4 border-t border-gray-200">
        <button type="submit" className="btn-primary w-full sm:w-auto" disabled={isSubmitting}>
          {isSubmitting
            ? "Wird gespeichert..."
            : mode === "edit"
              ? "Änderungen speichern"
              : "Notfalldatensatz erstellen & QR-Code generieren"}
        </button>
      </div>
    </form>
  );
}
