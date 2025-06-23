import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stratosphere | Cloud Storage Platform",
  description:
    "Stratosphere is a cloud storage platform that provides scalable and secure storage solutions for your data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfairDisplay.variable} antialiased`}
      >
        <ThemeProvider attribute="class">
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
