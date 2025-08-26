import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { HistoryProvider } from "@/contexts/history-context"

export const metadata: Metadata = {
  title: "QR Code & Encurtador de Links",
  description: "Gerador de QR Code e encurtador de URLs com histórico",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <HistoryProvider>{children}</HistoryProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
