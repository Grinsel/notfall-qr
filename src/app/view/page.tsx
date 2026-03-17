"use client";

import { useEffect, useState } from "react";
import { parseHash, decrypt } from "@/lib/crypto";
import { parseStructuredContent, StructuredSection } from "@/lib/emergency-data";
import { Logo } from "@/components/Logo";

const SECTION_LABELS: Record<string, string> = {
  PERSON: "Persoenliche Daten",
  WOHNUNG: "Wohnung / Gebaeude",
  MEDIZINISCH: "Medizinische Daten",
  NOTFALLKONTAKTE: "Notfallkontakte",
  SONSTIGES: "Sonstiges",
};

function StructuredView({ sections }: { sections: StructuredSection[] }) {
  return (
    <div className="space-y-4">
      {sections.map((section, i) => (
        <div key={i} className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
            {SECTION_LABELS[section.title] || section.title}
          </h2>
          <dl className="space-y-2">
            {section.entries.map((entry, j) => (
              <div key={j} className="flex flex-col sm:flex-row sm:gap-2">
                {entry.label && (
                  <dt className="text-gray-400 text-sm sm:min-w-[140px] shrink-0">
                    {entry.label}:
                  </dt>
                )}
                <dd className="text-gray-100 text-lg">{entry.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

export default function ViewPage() {
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function decryptFromHash() {
      try {
        const hash = window.location.hash;
        if (!hash) {
          setError(true);
          setLoading(false);
          return;
        }

        const parsed = parseHash(hash);
        if (!parsed) {
          setError(true);
          setLoading(false);
          return;
        }

        const plaintext = await decrypt(parsed.encryptedData, parsed.iv, parsed.key);
        setContent(plaintext);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    decryptFromHash();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-5xl mb-6">&#9888;</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            QR-Code ungueltig oder beschaedigt
          </h1>
          <p className="text-gray-400 text-sm">
            Die Daten konnten nicht entschluesselt werden.
          </p>
        </div>
      </div>
    );
  }

  const structured = parseStructuredContent(content);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Emergency header */}
      <div className="bg-emergency-600 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Logo className="w-8 h-8 shrink-0" />
          <div>
            <h1 className="text-lg font-bold">Notfallinformationen</h1>
            <p className="text-sm text-white/80">Notfall-QR</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {structured ? (
          <StructuredView sections={structured} />
        ) : (
          <pre className="whitespace-pre-wrap font-sans text-lg sm:text-xl leading-relaxed text-gray-100">
            {content}
          </pre>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-2xl mx-auto px-4 pb-8">
        <div className="border-t border-gray-700 pt-4 text-xs text-gray-500 text-center">
          Notfall-QR &ndash; Daten nur im QR-Code gespeichert, kein Server-Zugriff.
        </div>
      </div>
    </div>
  );
}
