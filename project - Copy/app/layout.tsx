import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { Navbar } from "@/components/dashboard/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AquaFarm Dashboard",
  description: "Smart aquaculture monitoring and management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative min-h-screen">
            <Navbar />
            <div className="fixed top-4 right-4 z-50">
              <ModeToggle />
            </div>
            <main>{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
