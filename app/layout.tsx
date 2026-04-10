import type { Metadata } from "next";
import { Roboto, Rubik } from "next/font/google";
import "./globals.css";

const kincstartoBody = Roboto({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["100", "300", "400", "500", "700", "900"],
  style: "normal",
});

const kincstartoDisplay = Rubik({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["600", "700", "800", "900"],
  style: "normal",
});

export const metadata: Metadata = {
  title: "FM-Space",
  description: "FM-Space portfolio"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="hu"
      className={`${kincstartoBody.variable} ${kincstartoDisplay.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
