import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/presentation/components/common/Header";
import Footer from "@/presentation/components/common/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Métodos Numéricos | Calculadora Interactiva",
  description:
    "Herramienta interactiva para resolver problemas de métodos numéricos: Bisección, Newton-Raphson, Simpson, Lagrange y más. Visualización paso a paso con gráficas dinámicas.",
  keywords: [
    "métodos numéricos",
    "bisección",
    "newton-raphson",
    "simpson",
    "lagrange",
    "interpolación",
    "integración numérica",
    "raíces de ecuaciones",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
