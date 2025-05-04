"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, LinkIcon } from "lucide-react"
import { toast } from "sonner"
import { LinkHistory } from "@/components/link-history"

type LinkItem = {
  id: string
  originalUrl: string
  shortUrl?: string
  qrCode?: boolean
  createdAt: Date
}

export function LinkShortener() {
  const [url, setUrl] = useState("")
  const [history, setHistory] = useState<LinkItem[]>([])
  const [activeTab, setActiveTab] = useState("qrcode")
  const [isGenerating, setIsGenerating] = useState(false)

  // Carregar histórico do localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("linkHistory")
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory)
        // Converter strings de data para objetos Date
        const historyWithDates = parsedHistory.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
        }))
        setHistory(historyWithDates)
      } catch (e) {
        console.error("Erro ao carregar histórico:", e)
      }
    }
  }, [])

  // Salvar histórico no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem("linkHistory", JSON.stringify(history))
  }, [history])

  // Função para encurtar URL (simulada)
  const shortenUrl = (originalUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      // Simulando uma chamada de API
      setTimeout(() => {
        // Gerar um código aleatório de 6 caracteres
        const randomCode = Math.random().toString(36).substring(2, 8)
        resolve(`https://short.url/${randomCode}`)
      }, 800)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) {
      toast.error("URL vazia", {
        description: "Por favor, insira uma URL válida",
      })
      return
    }

    // Validar URL
    try {
      new URL(url)
    } catch (e) {
      toast.error("URL inválida", {
        description: "Por favor, insira uma URL válida",
      })
      return
    }

    setIsGenerating(true)

    try {
      const newItem: LinkItem = {
        id: Date.now().toString(),
        originalUrl: url,
        createdAt: new Date(),
      }

      if (activeTab === "shortener") {
        const shortUrl = await shortenUrl(url)
        newItem.shortUrl = shortUrl
      } else {
        newItem.qrCode = true
      }

      setHistory([newItem, ...history])

      toast.success(activeTab === "qrcode" ? "QR Code gerado" : "URL encurtada", {
        description: "Operação concluída com sucesso!",
      })
    } catch (error) {
      toast.error("Erro", {
        description: "Ocorreu um erro ao processar sua solicitação",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copiado!", {
      description: "Conteúdo copiado para a área de transferência",
    })
  }

  const handleDelete = (id: string) => {
    setHistory(history.filter((item) => item.id !== id))
    toast.success("Item removido", {
      description: "O item foi removido do histórico",
    })
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle>Gerar novo link</CardTitle>
          <CardDescription>Insira uma URL para gerar um QR Code ou encurtá-la</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="qrcode" className="flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                <span>QR Code</span>
              </TabsTrigger>
              <TabsTrigger value="shortener" className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                <span>Encurtador</span>
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="text"
                  placeholder="https://exemplo.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
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

      <LinkHistory history={history} onCopy={handleCopy} onDelete={handleDelete} />
    </div>
  )
}
