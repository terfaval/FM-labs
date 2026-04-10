import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const kincstartoBody = localFont({
  src: "./fonts/Roboto-VariableFont_wdth,wght.ttf",
  variable: "--font-body",
  display: "swap",
  weight: "100 900",
  style: "normal"
});

const kincstartoDisplay = localFont({
  src: "./fonts/Rubik-VariableFont_wght.ttf",
  variable: "--font-heading",
  display: "swap",
  weight: "600 900",
  style: "normal"
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
