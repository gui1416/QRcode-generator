"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useHistory } from "@/hooks/use-history"
import { HistorySection } from "@/components/history-section"

export function LinkShortener() {
 const [url, setUrl] = useState("")
 const [activeTab, setActiveTab] = useState<"qrcode" | "shortener">("qrcode")
 const [isGenerating, setIsGenerating] = useState(false)
 const { addToHistory } = useHistory()

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (isGenerating) return
  if (!url) {
   toast.error("URL vazia", { description: "Por favor, insira uma URL válida" })
   return
  }
  try {
   new URL(url)
  } catch {
   toast.error("URL inválida", { description: "Por favor, insira uma URL válida" })
   return
  }
  setIsGenerating(true)
  try {
   if (activeTab === "shortener") {
    const response = await fetch("/api/shorten", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ url })
    })
    if (!response.ok) throw new Error("Erro ao encurtar a URL")
    const data = await response.json()
    addToHistory({
     type: "link",
     originalUrl: url,
     shortUrl: data.shortUrl // Corrigido para shortUrl
    })
    toast.success("URL encurtada", { description: "Operação concluída com sucesso!" })
   } else {
    addToHistory({
     type: "qr",
     originalUrl: url,
     qrCode: url
    })
    toast.success("QR Code gerado", { description: "Operação concluída com sucesso!" })
   }
   setUrl("")
  } catch {
   toast.error("Erro", { description: "Ocorreu um erro ao processar sua solicitação" })
  } finally {
   setIsGenerating(false)
  }
 }

 return (
  <div className="max-w-3xl mx-auto">
   <Card className="mb-8 shadow-lg">
    <CardHeader>
     <CardTitle>Gerar novo link</CardTitle>
    </CardHeader>
    <CardContent>
     <Tabs value={activeTab} onValueChange={v => setActiveTab(v as "qrcode" | "shortener")} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
       <TabsTrigger value="qrcode" className="flex items-center gap-2">QR Code</TabsTrigger>
       <TabsTrigger value="shortener" className="flex items-center gap-2">Encurtador</TabsTrigger>
      </TabsList>
      <form onSubmit={handleSubmit} className="space-y-4">
       <div className="flex flex-col sm:flex-row gap-2">
        <Input
         type="text"
         placeholder="https://exemplo.com"
         value={url}
         onChange={e => setUrl(e.target.value)}
         className="flex-1"
        />
        <Button type="submit" disabled={isGenerating} className="whitespace-nowrap">
         {isGenerating ? "Gerando..." : activeTab === "qrcode" ? "Gerar QR Code" : "Encurtar URL"}
        </Button>
       </div>
      </form>
     </Tabs>
    </CardContent>
   </Card>
   <HistorySection />
  </div>
 )
}
