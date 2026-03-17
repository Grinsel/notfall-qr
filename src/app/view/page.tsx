"use client";

import { useEffect, useState } from "react";
import { parseHash, decrypt } from "@/lib/crypto";

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
            QR-Code ungültig oder beschädigt
          </h1>
          <p className="text-gray-400 text-sm">
            Die Daten konnten nicht entschlüsselt werden.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Emergency header */}
      <div className="bg-emergency-600 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <svg className="w-8 h-8 text-white shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="currentColor" fillOpacity="0.3" />
            <path d="M16 6L16 26M6 16H26" stroke="white" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div>
            <h1 className="text-lg font-bold">Notfallinformationen</h1>
            <p className="text-sm text-white/80">Notfall-QR</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <pre className="whitespace-pre-wrap font-sans text-lg sm:text-xl leading-relaxed text-gray-100">
          {content}
        </pre>
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
