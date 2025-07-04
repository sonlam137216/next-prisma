import type { Metadata } from "next";
import dynamic from "next/dynamic";
import "./globals.css";
import "./montserrat-font.css";
import LayoutClient from "./layout-client";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const ConditionalFooter = dynamic(() => import("../components/ConditionalFooter"));

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="font-sans">
      <body className="flex flex-col min-h-screen font-sans">
        <LayoutClient>
          {children}
        </LayoutClient>
        <ConditionalFooter />
      </body>
    </html>
  );
}