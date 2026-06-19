import { Inter } from "next/font/google";
import "./globals.css";
import "../components.css";
import { AppProvider } from "@/lib/store";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Makan Pintar",
  description: "Budget makan harian yang ngerti kondisi dompet",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
