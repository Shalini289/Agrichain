import "./globals.css";
import Navbar from "@/components/Navbar";
import Chatbot from "@/components/Chatbot";

export const metadata = {
  title: "AgriChain",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Navbar />
        <div className="container">{children}</div>
         <Chatbot />
      </body>
    </html>
  );
}