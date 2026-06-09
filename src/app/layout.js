import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";

const dmsans = DM_Sans({ subsets: ["latin"], variable: "--font-dmsans", preload: false });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", preload: false });

export const metadata = {
  metadataBase: new URL("https://www.kinoovtc.ac.ke"),
  title: "Kinoo Vocational Training Centre | Skills for Life",
  description: "Kiambu County's premier public vocational training centre. NITA & KNEC certified courses in Food & Beverage, Electronics, Hair Dressing, Plumbing, and more. Intake ongoing!",
  keywords: "Kinoo VTC, vocational training Kiambu, NITA courses Kenya, KNEC artisan, technical college Kikuyu, affordable vocational training",
  icons: {
    icon: [{ url: "/kvtc_logo.png", type: "image/png" }],
    shortcut: "/kvtc_logo.png",
    apple: "/kvtc_logo.png",
  },
  openGraph: {
    title: "Kinoo VTC – Skills for Life | Kiambu County",
    description: "NITA & KNEC certified vocational training in Kikuyu, Kiambu. 13+ courses, subsidised fees. Apply today!",
    url: "https://www.kinoovtc.ac.ke",
    siteName: "Kinoo VTC",
    images: [
      {
        url: "/kvtc_logo.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_KE",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmsans.variable} ${playfair.variable}`} data-scroll-behavior="smooth">
      <body className={dmsans.className}>
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
