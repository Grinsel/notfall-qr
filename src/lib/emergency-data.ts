export interface EmergencyContact {
  name: string;
  phone: string;
}

export interface EmergencyData {
  // Persönliche Daten
  name: string;
  birthdate: string;
  gender: string;
  bloodType: string;

  // Medizinische Daten
  conditions: string;
  allergies: string;
  medications: string;
  implants: string;

  // Notfallkontakte
  contacts: EmergencyContact[];

  // Sonstiges
  organDonor: string;
  livingWill: string;
  insurance: string;
  notes: string;
}

export function createEmptyEmergencyData(): EmergencyData {
  return {
    name: "",
    birthdate: "",
    gender: "",
    bloodType: "",
    conditions: "",
    allergies: "",
    medications: "",
    implants: "",
    contacts: [{ name: "", phone: "" }],
    organDonor: "",
    livingWill: "",
    insurance: "",
    notes: "",
  };
}

export function serializeEmergencyData(data: EmergencyData): string {
  const lines: string[] = [];

  lines.push("NOTFALLINFORMATIONEN");
  lines.push("====================");

  // Person
  const personLines: string[] = [];
  if (data.name.trim()) personLines.push(`Name: ${data.name.trim()}`);
  if (data.birthdate.trim()) personLines.push(`Geburtsdatum: ${data.birthdate.trim()}`);
  if (data.gender) personLines.push(`Geschlecht: ${data.gender}`);
  if (data.bloodType) personLines.push(`Blutgruppe: ${data.bloodType}`);

  if (personLines.length > 0) {
    lines.push("");
    lines.push("[PERSON]");
    lines.push(...personLines);
  }

  // Medizinisch
  const medLines: string[] = [];
  if (data.conditions.trim()) medLines.push(`Vorerkrankungen: ${data.conditions.trim()}`);
  if (data.allergies.trim()) medLines.push(`Allergien: ${data.allergies.trim()}`);
  if (data.medications.trim()) medLines.push(`Medikamente: ${data.medications.trim()}`);
  if (data.implants.trim()) medLines.push(`Implantate: ${data.implants.trim()}`);

  if (medLines.length > 0) {
    lines.push("");
    lines.push("[MEDIZINISCH]");
    lines.push(...medLines);
  }

  // Notfallkontakte
  const contactLines: string[] = [];
  data.contacts.forEach((c, i) => {
    const name = c.name.trim();
    const phone = c.phone.trim();
    if (name || phone) {
      const parts = [name, phone].filter(Boolean).join(": ");
      contactLines.push(`${i + 1}. ${parts}`);
    }
  });

  if (contactLines.length > 0) {
    lines.push("");
    lines.push("[NOTFALLKONTAKTE]");
    lines.push(...contactLines);
  }

  // Sonstiges
  const otherLines: string[] = [];
  if (data.organDonor) otherLines.push(`Organspender: ${data.organDonor}`);
  if (data.livingWill.trim()) otherLines.push(`Patientenverfuegung: ${data.livingWill.trim()}`);
  if (data.insurance.trim()) otherLines.push(`Krankenkasse: ${data.insurance.trim()}`);
  if (data.notes.trim()) otherLines.push(`Besondere Hinweise: ${data.notes.trim()}`);

  if (otherLines.length > 0) {
    lines.push("");
    lines.push("[SONSTIGES]");
    lines.push(...otherLines);
  }

  return lines.join("\n");
}

export interface StructuredSection {
  title: string;
  entries: { label: string; value: string }[];
}

const SECTION_HEADER_RE = /^\[(.+)\]$/;

export function parseStructuredContent(text: string): StructuredSection[] | null {
  const lines = text.split("\n");

  // Must start with our header
  if (!lines[0]?.startsWith("NOTFALLINFORMATIONEN")) return null;

  const sections: StructuredSection[] = [];
  let currentSection: StructuredSection | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("=")) continue;
    if (trimmed === "NOTFALLINFORMATIONEN") continue;

    const headerMatch = trimmed.match(SECTION_HEADER_RE);
    if (headerMatch) {
      currentSection = { title: headerMatch[1], entries: [] };
      sections.push(currentSection);
      continue;
    }

    if (currentSection) {
      // Numbered contact lines: "1. Name: Phone"
      const numberedMatch = trimmed.match(/^\d+\.\s+(.+)$/);
      if (numberedMatch) {
        const colonIdx = numberedMatch[1].indexOf(": ");
        if (colonIdx > -1) {
          currentSection.entries.push({
            label: numberedMatch[1].slice(0, colonIdx),
            value: numberedMatch[1].slice(colonIdx + 2),
          });
        } else {
          currentSection.entries.push({ label: "", value: numberedMatch[1] });
        }
        continue;
      }

      // Regular "Label: Value" lines
      const colonIdx = trimmed.indexOf(": ");
      if (colonIdx > -1) {
        currentSection.entries.push({
          label: trimmed.slice(0, colonIdx),
          value: trimmed.slice(colonIdx + 2),
        });
      } else {
        currentSection.entries.push({ label: "", value: trimmed });
      }
    }
  }

  return sections.length > 0 ? sections : null;
}

export function isEmergencyDataEmpty(data: EmergencyData): boolean {
  return (
    !data.name.trim() &&
    !data.birthdate.trim() &&
    !data.gender &&
    !data.bloodType &&
    !data.conditions.trim() &&
    !data.allergies.trim() &&
    !data.medications.trim() &&
    !data.implants.trim() &&
    !data.contacts.some((c) => c.name.trim() || c.phone.trim()) &&
    !data.organDonor &&
    !data.livingWill.trim() &&
    !data.insurance.trim() &&
    !data.notes.trim()
  );
}
