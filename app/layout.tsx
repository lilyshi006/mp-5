import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";

const mono = Roboto_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CS303 URL Shortener",
  description: "Shorten your long URLs into compact, shareable links",
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en">
      <body className={`${mono.className} flex min-h-screen flex-col text-[#5C3D3D]`}>
      <header className="bg-[#FFF4DE] px-6 py-4 text-2xl font-bold">
        CS303 URL Shortener
      </header>
      {children}
      </body>
      </html>
  );
}