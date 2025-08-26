"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface HistoryItem {
 id: string
 type: "qr" | "link"
 originalUrl: string
 shortUrl?: string
 qrCode?: string
 createdAt: Date
}

interface HistoryContextType {
 history: HistoryItem[]
 addToHistory: (item: Omit<HistoryItem, "id" | "createdAt">) => void
 removeFromHistory: (id: string) => void
 clearHistory: () => void
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined)

export function HistoryProvider({ children }: { children: ReactNode }) {
 const [history, setHistory] = useState<HistoryItem[]>([])

 useEffect(() => {
  const savedHistory = localStorage.getItem("url-history")
  if (savedHistory) {
   const parsed: Array<Omit<HistoryItem, "createdAt"> & { createdAt: string | Date }> = JSON.parse(savedHistory)
   setHistory(
    parsed.map((item) => ({
     ...item,
     createdAt: new Date(item.createdAt),
    })),
   )
  }
 }, [])

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

 return (
  <HistoryContext.Provider value={{ history, addToHistory, removeFromHistory, clearHistory }}>
   {children}
  </HistoryContext.Provider>
 )
}

export function useHistory() {
 const context = useContext(HistoryContext)
 if (context === undefined) {
  throw new Error("useHistory must be used within a HistoryProvider")
 }
 return context
}
