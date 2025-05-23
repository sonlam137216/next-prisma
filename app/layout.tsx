import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import LayoutClient from "./layout-client";
import dynamic from "next/dynamic";

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
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <LayoutClient>
          {children}
        </LayoutClient>
        <ConditionalFooter />
      </body>
    </html>
  );
}