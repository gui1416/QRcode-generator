import { QRGenerator } from "@/components/qr-generator"
import { HistorySection } from "@/components/history-section"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-center flex-1">QR Code & Encurtador de Links</h1>
          <ThemeToggle />
        </div>

        <div className="space-y-8">
          <QRGenerator />
          <HistorySection />
        </div>
      </div>
    </div>
  )
}
