import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Writer — Escritura Profesional",
  description:
    "Aplicación de escritura profesional, local-first y de código abierto.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased dark`}>
      <body className="min-h-full bg-zinc-950 text-zinc-100 font-sans">
        {children}
      </body>
    </html>
  );
}
