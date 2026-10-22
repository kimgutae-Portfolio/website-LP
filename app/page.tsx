import { siteConfig } from "@/site.config";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Pain } from "@/components/Pain";
import { Promises } from "@/components/Promises";
import { Demo } from "@/components/Demo";
import { Pricing } from "@/components/Pricing";
import { Flow } from "@/components/Flow";
import { InstagramFeed } from "@/components/InstagramFeed";
import { Faq } from "@/components/Faq";
import { Cta } from "@/components/Cta";
import { Footer } from "@/components/Footer";
import { FloatingLine } from "@/components/FloatingLine";
import { Columns } from "@/components/Columns";

// 구조화 데이터: 사이트명과 사업 정보를 Google에 일관된 형태로 전달한다.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteConfig.meta.url}/#website`,
      url: siteConfig.meta.url,
      name: siteConfig.meta.siteName,
      inLanguage: "ja-JP",
    },
    {
      "@type": ["Organization", "ProfessionalService"],
      "@id": `${siteConfig.meta.url}/#organization`,
      name: siteConfig.meta.siteName,
      description: siteConfig.meta.description,
      url: siteConfig.meta.url,
      email: siteConfig.contact.email,
      logo: `${siteConfig.meta.url}/brand/machinowebs-icon-1024.png`,
      image: `${siteConfig.meta.url}/opengraph-image`,
      areaServed: {
        "@type": "City",
        name: "堺市",
        containedInPlace: { "@type": "AdministrativeArea", name: "大阪府" },
      },
      priceRange: `制作初期費用${siteConfig.pricing.initialCost}円〜・月額運用費${siteConfig.pricing.monthlyFrom}円〜（${siteConfig.pricing.priceTaxNote}）`,
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <Hero />
        <Demo />
        <Pain />
        <Promises />
        <Pricing />
        <Flow />
        <Columns />
        <InstagramFeed />
        <Faq />
        <Cta />
      </main>
      <Footer />
      <FloatingLine afterHero />
    </>
  );
}
