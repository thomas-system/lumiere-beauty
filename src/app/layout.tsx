import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import WhatsAppButton from "./components/WhatsAppButton";
import CookieConsent from "./components/CookieConsent";
import { LanguageProvider } from "./components/LanguageContext";
import LanguageModal from "./components/LanguageModal";

export const metadata: Metadata = {
  title: "LUMIERE - Beauty & Elegance",
  description: "Luxury skincare and beauty crafted for you.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <LanguageModal />
          <Header />
          <main>{children}</main>
          <WhatsAppButton />
          <CookieConsent />
        </LanguageProvider>
      </body>
    </html>
  );
}