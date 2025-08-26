"use client"

import { useState, useEffect } from "react"

export interface HistoryItem {
 id: string
 type: "qr" | "link"
 originalUrl: string
 shortUrl?: string
 qrCode?: string
 createdAt: Date
}

export function useHistory() {
 const [history, setHistory] = useState<HistoryItem[]>([])

 // Atualiza o estado sempre que o localStorage mudar em outras abas
 useEffect(() => {
  const updateHistory = () => {
   const savedHistory = localStorage.getItem("url-history")
   if (savedHistory) {
    const parsed = JSON.parse(savedHistory)
    setHistory(
     (parsed as Array<Omit<HistoryItem, "createdAt"> & { createdAt: string | Date }>).map((item) => ({
      ...item,
      createdAt: typeof item.createdAt === "string" ? new Date(item.createdAt) : item.createdAt,
     })),
    )
   } else {
    setHistory([])
   }
  }
  window.addEventListener("storage", updateHistory)
  return () => window.removeEventListener("storage", updateHistory)
 }, [])

 // Atualiza o estado imediatamente após qualquer operação local
 const syncHistory = () => {
  const savedHistory = localStorage.getItem("url-history")
  if (savedHistory) {
   const parsed = JSON.parse(savedHistory)
   setHistory(
    (parsed as Array<Omit<HistoryItem, "createdAt"> & { createdAt: string | Date }>).map((item) => ({
     ...item,
     createdAt: typeof item.createdAt === "string" ? new Date(item.createdAt) : item.createdAt,
    })),
   )
  } else {
   setHistory([])
  }
 }

 const addToHistory = (item: Omit<HistoryItem, "id" | "createdAt">) => {
  const newItem: HistoryItem = {
   ...item,
   id: Date.now().toString(),
   createdAt: new Date(),
  }
  const updatedHistory = [newItem, ...history].slice(0, 30)
  setHistory(updatedHistory)
  localStorage.setItem("url-history", JSON.stringify(updatedHistory))
  syncHistory()
 }

 const removeFromHistory = (id: string) => {
  const updatedHistory = history.filter((item) => item.id !== id)
  setHistory(updatedHistory)
  localStorage.setItem("url-history", JSON.stringify(updatedHistory))
  syncHistory()
 }

 const clearHistory = () => {
  setHistory([])
  localStorage.removeItem("url-history")
  syncHistory()
 }

 return {
  history,
  addToHistory,
  removeFromHistory,
  clearHistory,
 }
}
