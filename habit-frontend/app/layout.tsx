import "./globals.css";
import { DM_Serif_Display, DM_Sans, JetBrains_Mono } from "next/font/google";
import Providers from "./providers";




const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const jetMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${dmSerif.variable} ${dmSans.variable} ${jetMono.variable}`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

