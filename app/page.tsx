import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Pain } from "@/components/Pain";
import { Promises } from "@/components/Promises";
import { Demo } from "@/components/Demo";
import { Pricing } from "@/components/Pricing";
import { Flow } from "@/components/Flow";
import { Owner } from "@/components/Owner";
import { Faq } from "@/components/Faq";
import { Cta } from "@/components/Cta";
import { Footer } from "@/components/Footer";
import { FloatingLine } from "@/components/FloatingLine";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Pain />
        <Promises />
        <Demo />
        <Pricing />
        <Flow />
        <Owner />
        <Faq />
        <Cta />
      </main>
      <Footer />
      <FloatingLine />
    </>
  );
}
