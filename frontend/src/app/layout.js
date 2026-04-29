import "./globals.css";
import Navbar from "@/components/Navbar";
import Notification from "@/components/Notification";

export const metadata = {
  title: "AgriChain 🌾",
  description: "AI + Blockchain platform for smart farming",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        
        {/* 🌈 Background */}
        <div className="bg-gradient"></div>

        {/* 🧭 Navbar */}
        <header>
          <Navbar />
        </header>

        {/* 🔔 Notifications */}
        <div className="notification-wrapper">
          <Notification />
        </div>

        {/* 📦 Main Content */}
        <main className="container">
          {children}
        </main>

        {/* 🌿 Footer */}
        <footer>
          © {new Date().getFullYear()} AgriChain 🌾 — Powered by AI + Blockchain
        </footer>

      </body>
    </html>
  );
}
