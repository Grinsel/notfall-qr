"use client";

import Link from "next/link";
import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="no-print bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary-700 hover:text-primary-800 transition-colors">
          <Logo className="w-8 h-8" />
          <span className="text-xl font-bold">Notfall-QR</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/info" className="text-sm text-gray-600 hover:text-gray-900">
            Info
          </Link>
          <Link href="/setup" className="btn-primary text-sm">
            QR-Code erstellen
          </Link>
        </nav>
      </div>
    </header>
  );
}
