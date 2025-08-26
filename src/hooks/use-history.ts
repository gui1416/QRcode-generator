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

 // Atualiza o estado sempre que o localStorage mudar (inclusive em outras abas ou por outros componentes)
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

 useEffect(() => {
  // Atualiza o estado local sempre que o próprio componente alterar o localStorage
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
 }, [history.length])

 const addToHistory = (item: Omit<HistoryItem, "id" | "createdAt">) => {
  const newItem: HistoryItem = {
   ...item,
   id: Date.now().toString(),
   createdAt: new Date(),
  }

  const updatedHistory = [newItem, ...history].slice(0, 30)
  setHistory(updatedHistory)
  localStorage.setItem("url-history", JSON.stringify(updatedHistory))
 }

 const removeFromHistory = (id: string) => {
  const updatedHistory = history.filter((item) => item.id !== id)
  setHistory(updatedHistory)
  localStorage.setItem("url-history", JSON.stringify(updatedHistory))
 }

 const clearHistory = () => {
  setHistory([])
  localStorage.removeItem("url-history")
 }

 return {
  history,
  addToHistory,
  removeFromHistory,
  clearHistory,
 }
}
