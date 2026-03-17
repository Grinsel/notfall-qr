import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Notfall-QR – Notfallinformationen für Einsatzkräfte",
  description:
    "Hinterlegen Sie wichtige Informationen für Feuerwehr und Rettungsdienst. QR-Code an der Haustür – schneller Zugang zu Notfalldaten.",
  robots: "noindex, nofollow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
