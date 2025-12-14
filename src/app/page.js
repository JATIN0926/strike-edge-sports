import BestSellers from "@/components/Homepage/BestSellers/BestSellers";
import Footer from "@/components/Homepage/Footer/Footer";
import HeroCarousel from "@/components/Homepage/HeroCarousel/HeroCarousel";
import Navbar from "@/components/Homepage/Navbar/Navbar";
import { Toaster } from "react-hot-toast";

export default function Home() {
  return (
    <>
      <Toaster />
      <Navbar />
      <main className="w-screen max-w-full flex flex-col gap-8 bg-black px-3 md:px-8 pt-[5.5rem]">
        <HeroCarousel />
        <BestSellers />
        <Footer />
      </main>
    </>
  );
}
