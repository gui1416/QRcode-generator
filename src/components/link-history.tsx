"use client"

import { useState } from "react"
import { QRCodeCanvas } from "qrcode.react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Trash2, ExternalLink, QrCode, LinkIcon, Download } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useMobile } from "@/hooks/use-mobile"

type LinkItem = {
  id: string
  originalUrl: string
  shortUrl?: string
  qrCode?: boolean
  createdAt: Date
}

interface LinkHistoryProps {
  history: LinkItem[]
  onCopy: (text: string) => void
  onDelete: (id: string) => void
}

export function LinkHistory({ history, onCopy, onDelete }: LinkHistoryProps) {
  const [activeHistoryTab, setActiveHistoryTab] = useState("all")
  const isMobile = useMobile()

  const filteredHistory = history.filter((item) => {
    if (activeHistoryTab === "all") return true
    if (activeHistoryTab === "qrcode") return item.qrCode
    if (activeHistoryTab === "shortener") return !!item.shortUrl
    return true
  })

  const downloadQRCode = (id: string, url: string) => {
    const canvas = document.getElementById(`qr-canvas-${id}`) as HTMLCanvasElement | null
    if (canvas && canvas.toDataURL) {
      const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")

      const downloadLink = document.createElement("a")
      downloadLink.href = pngUrl
      downloadLink.download = `qrcode-${url.replace(/[^a-zA-Z0-9]/g, "-").substring(0, 15)}.png`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    }
  }

  if (history.length === 0) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Histórico</CardTitle>
          <CardDescription>Seu histórico de links aparecerá aqui</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8 text-gray-500">Nenhum link gerado ainda</CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Histórico</CardTitle>
        <CardDescription>Seus links e QR Codes gerados recentemente</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeHistoryTab} onValueChange={setActiveHistoryTab} className="w-full mb-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="qrcode" className="flex items-center gap-1">
              <QrCode className="h-3 w-3" />
              <span>QR Codes</span>
            </TabsTrigger>
            <TabsTrigger value="shortener" className="flex items-center gap-1">
              <LinkIcon className="h-3 w-3" />
              <span>Links</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {filteredHistory.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={item.qrCode ? "secondary" : "outline"}>
                        {item.qrCode ? "QR Code" : "Link Curto"}
                      </Badge>
                      <span className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleString()}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(item.id)}
                      className="h-8 w-8 text-gray-500 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="truncate text-sm font-medium mb-2">{item.originalUrl}</div>

                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    {item.qrCode && (
                      <div className="bg-white p-2 rounded-lg">
                        <QRCodeCanvas
                          id={`qr-canvas-${item.id}`}
                          value={item.originalUrl}
                          size={isMobile ? 120 : 100}
                          includeMargin
                          className="mx-auto"
                        />
                      </div>
                    )}

                    <div className="flex-1 w-full">
                      {item.shortUrl && (
                        <div className="flex items-center gap-2 mb-3">
                          <div className="text-sm font-medium truncate flex-1">{item.shortUrl}</div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onCopy(item.shortUrl!)}
                            className="h-8 w-8"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.open(item.shortUrl, "_blank")}
                            className="h-8 w-8"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onCopy(item.originalUrl)}
                          className="flex items-center gap-1"
                        >
                          <Copy className="h-3 w-3" />
                          <span>Copiar URL original</span>
                        </Button>

                        {item.qrCode && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadQRCode(item.id, item.originalUrl)}
                            className="flex items-center gap-1"
                          >
                            <Download className="h-3 w-3" />
                            <span>Baixar QR Code</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}