import type { Metadata } from "next";
import { Montserrat, Outfit, Roboto, Rubik, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "./mobile.css";

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

const derengoDisplay = Outfit({
  subsets: ["latin"],
  variable: "--font-derengo",
  display: "swap",
  weight: ["800"],
  style: "normal",
});

const urbanEcoLabDisplay = Montserrat({
  subsets: ["latin"],
  variable: "--font-urbanecolab",
  display: "swap",
  weight: ["400", "500", "600", "700", "900"],
  style: "normal",
});

export const metadata: Metadata = {
  title: "Térszövő",
  description: "Felfedezhető, bejárható digitális rendszereket építek komplex témákból. Ismerd meg mindet, merülj el bármelyikben!",
  icons: {
    icon: "/fm-labs_logo.svg"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="hu"
      className={`${kincstartoBody.variable} ${kincstartoDisplay.variable} ${lumiraDisplay.variable} ${derengoDisplay.variable} ${urbanEcoLabDisplay.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
