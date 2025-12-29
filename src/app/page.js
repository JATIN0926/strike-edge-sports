import BallsSection from "@/components/Homepage/BestSellers/BallsSection";
import BatsSection from "@/components/Homepage/BestSellers/BatsSection";
import HeroCarousel from "@/components/Homepage/HeroCarousel/HeroCarousel";
import SeeMoreProductsCTA from "@/components/Homepage/SeeMoreProductsCTA/SeeMoreProductsCTA";

export default function Home() {
  return (
    <>
      <main
        className="
         w-full
        bg-slate-50
        flex flex-col gap-10
        px-4 md:px-8
        pt-24
      "
      >
        <HeroCarousel />
        <BatsSection />
        <BallsSection />
        <SeeMoreProductsCTA />
      </main>
    </>
  );
}
