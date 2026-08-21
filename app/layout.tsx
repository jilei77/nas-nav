import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import BingWallpaper from "@/components/BingWallpaper";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";
import AdminWrapper from "@/components/AdminWrapper";

export const metadata: Metadata = {
  title: "NAS Navigation",
  description: "Your personal NAS portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <BingWallpaper />
          <LoginModal />
          <AdminWrapper />
          <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", position: "relative", zIndex: 1 }}>
            <Header />
            <div style={{ flex: 1 }}>
              {children}
            </div>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
