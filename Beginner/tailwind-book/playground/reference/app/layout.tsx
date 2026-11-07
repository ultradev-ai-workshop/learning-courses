import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Orbit · Small habits, big results",
  description:
    "A habit tracker landing page and dashboard built with Tailwind CSS.",
};

// Runs before the first paint: dark if the user chose it, or chose nothing and the system is dark.
const themeScript = `document.documentElement.classList.toggle("dark",
  localStorage.theme === "dark" ||
  (!("theme" in localStorage) && matchMedia("(prefers-color-scheme: dark)").matches));`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
