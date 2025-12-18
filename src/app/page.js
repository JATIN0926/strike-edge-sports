import BestSellers from "@/components/Homepage/BestSellers/BestSellers";
import HeroCarousel from "@/components/Homepage/HeroCarousel/HeroCarousel";

export default function Home() {
  return (
    <>
      <main className="w-screen max-w-full flex flex-col gap-8 px-3 md:px-8 pt-[5.5rem]">
        <HeroCarousel />
        <BestSellers />
      </main>
    </>
  );
}
