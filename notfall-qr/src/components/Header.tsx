"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="no-print bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary-700 hover:text-primary-800 transition-colors">
          <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="currentColor" />
            <path d="M16 6L16 26M6 16H26" stroke="white" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span className="text-xl font-bold">Notfall-QR</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/erstellen" className="btn-primary text-sm">
            QR-Code erstellen
          </Link>
        </nav>
      </div>
    </header>
  );
}
