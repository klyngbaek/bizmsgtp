/* eslint-disable */
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import { UserProvider } from '@auth0/nextjs-auth0/client';
import ErrorBoundary from '@/app/components/ErrorBoundary'

const inter = Inter({ subsets: ["latin"] });

// TODO: Add metadata to env vars
export const metadata: Metadata = {
  title: "KXL Consulting",
  description: "KXL Consulting - Meta Business Solutions Partner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Script
        src="https://connect.facebook.net/en_US/sdk.js"
        strategy="lazyOnload"
      />
      <UserProvider>
        <body className={inter.className}>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
          <SpeedInsights />
          <Analytics />
        </body>
      </UserProvider>
    </html>
  );
}
