import type { Metadata } from "next";
import { Roboto, Rubik, Space_Grotesk } from "next/font/google";
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

const lumiraDisplay = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-lumira",
  display: "swap",
  weight: ["400"],
  style: "normal",
});

export const metadata: Metadata = {
  title: "FM-Space",
  description: "FM-Space portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="hu"
      className={`${kincstartoBody.variable} ${kincstartoDisplay.variable} ${lumiraDisplay.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
