"use client"

import { useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Link, QrCode } from "lucide-react"
import { toast } from "sonner"
import { useHistory } from "@/hooks/use-history"
import { useMobile } from "@/hooks/use-mobile"

export function QRGenerator() {
 const [url, setUrl] = useState("")
 const [activeTab, setActiveTab] = useState("qr")
 const [isLoading, setIsLoading] = useState(false)
 const { addToHistory } = useHistory()
 const isMobile = useMobile()

 const isValidUrl = (string: string) => {
  try {
   new URL(string)
   return true
  } catch (_) {
   return false
  }
 }

 const generateQRCode = () => {
  if (!url.trim()) {
   toast.error("Por favor, insira uma URL")
   return
  }

  if (!isValidUrl(url)) {
   toast.error("Por favor, insira uma URL válida")
   return
  }

  addToHistory({
   type: "qr",
   originalUrl: url,
   qrCode: url,
  })

  toast.success("QR Code gerado com sucesso!")
 }

 const shortenUrl = async () => {
  if (!url.trim()) {
   toast.error("Por favor, insira uma URL")
   return
  }

  if (!isValidUrl(url)) {
   toast.error("Por favor, insira uma URL válida")
   return
  }

  setIsLoading(true)
  try {
   const response = await fetch("/api/shorten", {
    method: "POST",
    headers: {
     "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
   })

   const data = await response.json()

   if (data.error) {
    toast.error(data.error)
    return
   }

   addToHistory({
    type: "link",
    originalUrl: url,
    shortUrl: data.shorturl,
   })

   toast.success("URL encurtada com sucesso!")
   setUrl("")
  } catch (error) {
   toast.error("Erro ao encurtar URL")
  } finally {
   setIsLoading(false)
  }
 }

 const downloadQRCode = () => {
  const svg = document.querySelector("#qr-code-svg") as SVGElement
  if (!svg) return

  const svgData = new XMLSerializer().serializeToString(svg)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  const img = new Image()

  img.crossOrigin = "anonymous"
  img.onload = () => {
   canvas.width = img.width
   canvas.height = img.height
   ctx?.drawImage(img, 0, 0)

   const pngFile = canvas.toDataURL("image/png")
   const downloadLink = document.createElement("a")
   downloadLink.download = "qrcode.png"
   downloadLink.href = pngFile
   downloadLink.click()
  }

  img.src = "data:image/svg+xml;base64," + btoa(svgData)
 }

 return (
  <Card className="w-full max-w-2xl mx-auto">
   <CardHeader>
    <CardTitle className="text-center">Gerador de QR Code e Encurtador</CardTitle>
   </CardHeader>
   <CardContent>
    <Tabs value={activeTab} onValueChange={setActiveTab}>
     <TabsList className="grid w-full grid-cols-2">
      <TabsTrigger value="qr" className="flex items-center gap-2">
       <QrCode className="h-4 w-4" />
       QR Code
      </TabsTrigger>
      <TabsTrigger value="shorten" className="flex items-center gap-2">
       <Link className="h-4 w-4" />
       Encurtador
      </TabsTrigger>
     </TabsList>

     <div className="mt-6 space-y-4">
      <Input
       placeholder="Digite ou cole sua URL aqui..."
       value={url}
       onChange={(e) => setUrl(e.target.value)}
       onKeyDown={(e) => {
        if (e.key === "Enter") {
         activeTab === "qr" ? generateQRCode() : shortenUrl()
        }
       }}
      />

      <TabsContent value="qr" className="space-y-4">
       <Button onClick={generateQRCode} className="w-full" disabled={!url.trim()}>
        <QrCode className="h-4 w-4 mr-2" />
        Gerar QR Code
       </Button>

       {url && isValidUrl(url) && (
        <div className="flex flex-col items-center space-y-4 p-4 bg-muted rounded-lg">
         <QRCodeSVG id="qr-code-svg" value={url} size={isMobile ? 200 : 256} level="M" includeMargin />
         <Button onClick={downloadQRCode} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Baixar PNG
         </Button>
        </div>
       )}
      </TabsContent>

      <TabsContent value="shorten">
       <Button onClick={shortenUrl} className="w-full" disabled={!url.trim() || isLoading}>
        <Link className="h-4 w-4 mr-2" />
        {isLoading ? "Encurtando..." : "Encurtar URL"}
       </Button>
      </TabsContent>
     </div>
    </Tabs>
   </CardContent>
  </Card>
 )
}
