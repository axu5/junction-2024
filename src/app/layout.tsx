import HustleHiveLogoWithText from "@/../public/hustlehive-logo-text.png";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Image from "next/image";
import "./globals.css";
import Link from "next/link";
import { HexagonGroup } from "./hexagon";

const staatlichesRegular = localFont({
  src: "./fonts/Staatliches-Regular.ttf",
  variable: "--font-staatliches-regular",
});

export const metadata: Metadata = {
  title: "HustleHive",
  description: "Discover roles that just feel right.",
  icons: ["/hustlehive-logo.png"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${staatlichesRegular.variable} antialiased`}>
        <main className="mx-auto max-w-7xl px-8 pt-10 xl:px-20">
          <nav className="sticky flex w-full flex-row items-center justify-between">
            <Link href="/">
              <Image
                src={HustleHiveLogoWithText}
                alt="Hustlehive logo with text"
                className="max-w-24 object-cover object-center xl:-translate-x-32"
              />
            </Link>
          </nav>
          {children}

          <HexagonGroup className="bottom-5 left-3" />
          <HexagonGroup className="right-1/4 top-16" />
          <HexagonGroup className="bottom-1/3 right-10" />
        </main>
      </body>
    </html>
  );
}
