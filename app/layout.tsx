import type { Metadata } from "next";
import { headers } from "next/headers";
import { Playfair } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import WhatsAppButton from "@/components/WhatsAppButton";
import SmoothScroll from "@/components/SmoothScroll";
import { LanguageProvider } from "@/components/LanguageProvider";
import { baseMetadataForLang } from "@/lib/seo";
import { isLang, DEFAULT_LANG } from "@/lib/i18n";
import { getTranslation, type Lang } from "@/utils/translations";
import { getSiteUrl } from "@/lib/site";

// One typeface for the whole site: Playfair (2.0). Its optical-size axis cuts
// the high-contrast display forms for headlines and sturdier text forms for
// body copy and small caps labels automatically, so a single family covers
// every role.
const playfair = Playfair({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-site",
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
  const comingSoon = (await headers()).get("x-coming-soon") === "1";
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
    <html lang={lang} className={playfair.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* Wallet/crypto extensions inject their own <script> as body's first
            child before hydration, so React attribute-diffs it against this one.
            Nothing here changes between server and client, so suppressing is safe. */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
        {comingSoon ? (
          children
        ) : (
          <LanguageProvider initialLang={lang}>
            <SmoothScroll>
              <Navigation />
              {children}
              <Footer />
              <ScrollToTop />
              <WhatsAppButton />
            </SmoothScroll>
          </LanguageProvider>
        )}
      </body>
    </html>
  );
}
