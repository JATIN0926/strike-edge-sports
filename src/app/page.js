import BallsSection from "@/components/Homepage/BestSellers/BallsSection";
import BatsSection from "@/components/Homepage/BestSellers/BatsSection";
import BestSellers from "@/components/Homepage/BestSellers/BestSellers";
import HeroCarousel from "@/components/Homepage/HeroCarousel/HeroCarousel";

export default function Home() {
  return (
    <>
      <main
        className="
        min-h-screen w-full
        bg-slate-50
        flex flex-col gap-10
        px-4 md:px-8
        pt-24
      "
      >
        <HeroCarousel />
        {/* <BestSellers /> */}
        <BatsSection />
        <BallsSection />
      </main>
    </>
  );
}
