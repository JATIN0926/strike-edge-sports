import { Geist, Geist_Mono, Sora, Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/redux/Providers";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Homepage/Navbar/Navbar";
import Footer from "@/components/Homepage/Footer/Footer";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
``;
export const metadata = {
  title: "Strike Edge Sports",
  description: "Website for selling cricket related products",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Toaster
          containerStyle={{
            zIndex: 300,
          }}
        />
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
