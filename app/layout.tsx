import type { Metadata } from "next";
import { headers } from "next/headers";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import SmoothScroll from "@/components/SmoothScroll";
import { LanguageProvider } from "@/components/LanguageProvider";
import { baseMetadataForLang } from "@/lib/seo";
import { isLang, DEFAULT_LANG } from "@/lib/i18n";
import { getTranslation, type Lang } from "@/utils/translations";
import { getSiteUrl } from "@/lib/site";

// Optimize font loading with next/font
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-inter",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-cormorant",
});

async function getRequestLang(): Promise<Lang> {
  const h = await headers();
  const fromHeader = h.get("x-lang");
  if (isLang(fromHeader)) return fromHeader;
  return DEFAULT_LANG;
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getRequestLang();
  return baseMetadataForLang(lang);
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = await getRequestLang();
  const site = getSiteUrl();
  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    name: "Lila Catering",
    url: site ? String(site) : undefined,
    servesCuisine: "Moroccan",
    email: "info@lilacatering.com",
    telephone: "020 363 5478",
    address: {
      "@type": "PostalAddress",
      streetAddress: "De Dollard 11",
      postalCode: "1454 AT",
      addressLocality: "Watergang",
      addressCountry: "NL",
    },
    sameAs: [
      "https://www.instagram.com/lilacatering/",
      "https://www.facebook.com/lilacatering/",
      "https://www.tiktok.com/@lilacatering",
    ],
    slogan: String(getTranslation(lang, "footer.tagline") || ""),
    inLanguage: lang,
  };

  return (
    <html lang={lang} className={`${inter.variable} ${cormorantGaramond.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
        <LanguageProvider initialLang={lang}>
          <SmoothScroll>
            <Navigation />
            {children}
            <Footer />
            <ScrollToTop />
          </SmoothScroll>
        </LanguageProvider>
      </body>
    </html>
  );
}
