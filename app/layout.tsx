import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/app/context/AuthContext";

const genforgeFont = localFont({
  src: "../public/font.ttf",
  variable: "--font-genforge",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Genforge Studio - Lead Capture & Referral System",
  description: "Advanced lead generation and management platform for high-growth companies.",
};

 import { ThemeProvider2 } from "@/app/components/ThemeProvider2";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${genforgeFont.variable} h-full antialiased font-[family-name:var(--font-genforge)]`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider2 attribute="class" defaultTheme="dark" enableSystem={false}>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider2>
      </body>
    </html>
  );
}

