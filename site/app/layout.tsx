import type { Metadata } from "next"
import { Instrument_Serif, JetBrains_Mono, Geist } from "next/font/google"
import TopNav from "@/components/nav/TopNav"
import Footer from "@/components/Footer"
import "./globals.css"

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

export const metadata: Metadata = {
  title: "pointofμ",
  description: "Data stories, 42 seconds at a time.",
  metadataBase: new URL("https://pointofmu.com"),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${jetbrainsMono.variable} ${geistSans.variable}`}>
      <body className="font-sans min-h-screen flex flex-col">
        <TopNav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
