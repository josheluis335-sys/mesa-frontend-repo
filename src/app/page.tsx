import { Header } from "@/components/header/Header";
import { Hero } from "@/components/hero/Hero";
import { Features } from "@/components/features/Features";
import { Footer } from "@/components/footer/Footer";

export default function HomePage() {
  return (
    <main>
      <Header />
      <Hero />
      <Features />
      <Footer />
    </main>
  );
}
