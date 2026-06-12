import { Fraunces, Hanken_Grotesk, Anek_Tamil } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/providers/SmoothScroll";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

const anekTamil = Anek_Tamil({
  subsets: ["tamil", "latin"],
  weight: ["400", "600"],
  variable: "--font-anek-tamil",
  display: "swap",
});

export const metadata = {
  title: "Thayya™ — Move. Rise. Shine.",
  description:
    "Movement rooted in Indian rhythms. Find your beat, your people, your power — one class at a time. Made in India.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${hanken.variable} ${anekTamil.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* gate reveal-hiding CSS on JS availability before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
