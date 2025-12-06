import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import GlobalSidebar from "../components/dashboard/GlobalSidebar";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
});

export const metadata: Metadata = {
  title: "KAI Dashboard",
  description: "KAI SAAS Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${nunitoSans.variable} font-sans`}>
        {/* Global Sidebar - Persiste en todas las páginas */}
        <GlobalSidebar />
        
        {/* Contenido principal - Cambia según la ruta */}
        <main className="ml-14">
          {children}
        </main>
      </body>
    </html>
  );
}
