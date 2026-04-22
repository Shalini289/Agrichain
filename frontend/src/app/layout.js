import "./globals.css";
import Navbar from "@/components/Navbar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AgriChain 🌾",
  description: "AI + Blockchain platform for smart farming",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>

        {/* 🌈 Background */}
        <div className="bg-gradient" />

        {/* 🌐 Navbar */}
        <Navbar />

        {/* 📦 Main Container */}
        <main className="container">
          {children}
        </main>

      </body>
    </html>
  );
}