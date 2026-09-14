//* Components Imports
import Toaster from "@/components/ui/sonner";

import "./globals.css";
import { PwaRegister } from "@/components/pwa-register";
import { ThemeProvider } from "@/components/theme-provider";

//* Libraries Imports
import { Geist, Geist_Mono } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

//* Types Imports
import type { Metadata, Viewport } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "izi Freelas | Gestão para freelancers",
  description: "Clientes, tarefas e financeiro numa única plataforma para quem toca o negócio sozinho.",
  applicationName: "izi Freelas",
  appleWebApp: {
    capable: true,
    title: "izi Freelas",
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <NextTopLoader color="var(--foreground)" showSpinner={false} />
          {children}
          <Toaster position="top-right" />
          <PwaRegister />
        </ThemeProvider>
      </body>
    </html>
  );
}
