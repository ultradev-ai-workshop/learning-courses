import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { NavLinks } from "./_components/nav-links";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://reading-list.example.com"),
  title: { template: "%s · Reading List", default: "Reading List" },
  description: "Track the books you want to read.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} antialiased`}>
      <body className="bg-background text-foreground font-sans">
        <header className="mx-auto flex max-w-3xl items-center justify-between gap-4 p-6">
          <span className="text-lg font-bold">📚 Reading List</span>
          <NavLinks />
        </header>
        <main className="mx-auto max-w-3xl px-6 pb-16">{children}</main>
      </body>
    </html>
  );
}
