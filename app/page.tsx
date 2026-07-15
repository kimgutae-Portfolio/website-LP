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

// 구조화 데이터 (Google 검색·비즈니스 프로필과 정보 일치용)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: siteConfig.meta.siteName,
  description: siteConfig.meta.description,
  url: siteConfig.meta.url,
  email: siteConfig.contact.email,
  image: `${siteConfig.meta.url}/opengraph-image`,
  areaServed: {
    "@type": "City",
    name: "堺市",
    containedInPlace: { "@type": "AdministrativeArea", name: "大阪府" },
  },
  priceRange: "月額5,500円〜",
  founder: { "@type": "Person", name: siteConfig.owner.name },
};

// FAQ 구조화 데이터: 검색결과에 질문·답변이 펼쳐지는 리치 스니펫용
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: siteConfig.faq.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Header />
      <main>
        <Hero />
        <Pain />
        <Promises />
        <Demo />
        <Pricing />
        <Flow />
        <InstagramFeed />
        <Faq />
        <Cta />
      </main>
      <Footer />
      <FloatingLine />
    </>
  );
}
