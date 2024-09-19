import type { Metadata } from "next";
import "./globals.css";
import { TRPCProviders } from "./providers";

export const metadata: Metadata = {
  title: "Simple CTA Transit Map",
  description: "Quickly view train locations on each line on the CTA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <TRPCProviders>{children}</TRPCProviders>
      </body>
    </html>
  );
}
