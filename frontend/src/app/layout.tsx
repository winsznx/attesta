import "@/lib/polyfills";
import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { WalletProvider } from "@/components/providers/WalletProvider";
import { AppKitProvider } from "@/components/providers/AppKitProvider";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Attesta - Verify anything, prove everything",
  description:
    "Multi-chain legal document platform powered by AI, ICP, Constellation, Ethereum, and x402. Create, sign, and verify legal agreements with blockchain-backed proof.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppKitProvider>
            <WalletProvider>
              {children}
            </WalletProvider>
          </AppKitProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

