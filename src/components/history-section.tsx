"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { QRCodeSVG } from "qrcode.react"
import { Copy, ExternalLink, Trash2, Download, QrCode, Link } from "lucide-react"
import { toast } from "sonner"
import { useHistory } from "@/hooks/use-history"
import { useMobile } from "@/hooks/use-mobile"

export function HistorySection() {
 const { history, removeFromHistory } = useHistory()
 const [filter, setFilter] = useState("all")
 const isMobile = useMobile()

 const filteredHistory = history.filter((item) => {
  if (filter === "all") return true
  if (filter === "qr") return item.type === "qr"
  if (filter === "links") return item.type === "link"
  return true
 })

 const copyToClipboard = (text: string, type: string) => {
  navigator.clipboard.writeText(text)
  toast.success(`${type} copiado para a área de transferência!`)
 }

 const downloadQRCode = (url: string, id: string) => {
  const svg = document.querySelector(`#qr-${id}`) as SVGElement
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
   downloadLink.download = `qrcode-${id}.png`
   downloadLink.href = pngFile
   downloadLink.click()
  }

  img.src = "data:image/svg+xml;base64," + btoa(svgData)
 }

 const truncateUrl = (url: string, maxLength = 50) => {
  return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url
 }

 if (history.length === 0) {
  return (
   <Card className="w-full max-w-2xl mx-auto">
    <CardHeader>
     <CardTitle>Histórico</CardTitle>
    </CardHeader>
    <CardContent>
     <p className="text-muted-foreground text-center py-8">
      Nenhum item no histórico ainda. Gere um QR Code ou encurte uma URL para começar!
     </p>
    </CardContent>
   </Card>
  )
 }

 return (
  <Card className="w-full max-w-2xl mx-auto">
   <CardHeader>
    <CardTitle>Histórico ({history.length}/30)</CardTitle>
   </CardHeader>
   <CardContent>
    <Tabs value={filter} onValueChange={setFilter}>
     <TabsList className="grid w-full grid-cols-3">
      <TabsTrigger value="all">Todos ({history.length})</TabsTrigger>
      <TabsTrigger value="qr">QR Codes ({history.filter((h) => h.type === "qr").length})</TabsTrigger>
      <TabsTrigger value="links">Links ({history.filter((h) => h.type === "link").length})</TabsTrigger>
     </TabsList>

     <TabsContent value={filter} className="mt-4">
      <ScrollArea className="h-[400px] w-full">
       <div className="space-y-4">
        {filteredHistory.map((item) => (
         <div key={item.id} className="border rounded-lg p-4 space-y-3">
          <div className="flex items-start justify-between">
           <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
             <Badge variant={item.type === "qr" ? "default" : "secondary"}>
              {item.type === "qr" ? (
               <>
                <QrCode className="h-3 w-3 mr-1" />
                QR Code
               </>
              ) : (
               <>
                <Link className="h-3 w-3 mr-1" />
                Link Curto
               </>
              )}
             </Badge>
             <span className="text-xs text-muted-foreground">
              {item.createdAt.toLocaleString("pt-BR")}
             </span>
            </div>
            <p className="text-sm font-medium">{truncateUrl(item.originalUrl, isMobile ? 30 : 50)}</p>
            {item.shortUrl && <p className="text-sm text-blue-600 dark:text-blue-400">{item.shortUrl}</p>}
           </div>
           <Button variant="ghost" size="sm" onClick={() => removeFromHistory(item.id)}>
            <Trash2 className="h-4 w-4" />
           </Button>
          </div>

          {item.type === "qr" && item.qrCode && (
           <div className="flex flex-col items-center space-y-2 p-2 bg-muted rounded">
            <QRCodeSVG
             id={`qr-${item.id}`}
             value={item.qrCode}
             size={isMobile ? 120 : 150}
             level="M"
             includeMargin
            />
            <div className="flex gap-2">
             <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(item.originalUrl, "URL original")}
             >
              <Copy className="h-3 w-3 mr-1" />
              Copiar URL
             </Button>
             <Button variant="outline" size="sm" onClick={() => downloadQRCode(item.qrCode!, item.id)}>
              <Download className="h-3 w-3 mr-1" />
              Baixar
             </Button>
            </div>
           </div>
          )}

          {item.type === "link" && item.shortUrl && (
           <div className="flex flex-wrap gap-2">
            <Button
             variant="outline"
             size="sm"
             onClick={() => copyToClipboard(item.originalUrl, "URL original")}
            >
             <Copy className="h-3 w-3 mr-1" />
             Copiar Original
            </Button>
            <Button
             variant="outline"
             size="sm"
             onClick={() => copyToClipboard(item.shortUrl!, "Link encurtado")}
            >
             <Copy className="h-3 w-3 mr-1" />
             Copiar Curto
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.open(item.shortUrl, "_blank")}>
             <ExternalLink className="h-3 w-3 mr-1" />
             Abrir
            </Button>
           </div>
          )}
         </div>
        ))}
       </div>
      </ScrollArea>
     </TabsContent>
    </Tabs>
   </CardContent>
  </Card>
 )
}
