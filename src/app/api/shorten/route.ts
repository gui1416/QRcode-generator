import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
 try {
  const { url } = await request.json()

  if (!url) {
   return NextResponse.json({ error: "URL é obrigatória" }, { status: 400 })
  }

  // Validate URL format
  try {
   new URL(url)
  } catch {
   return NextResponse.json({ error: "URL inválida" }, { status: 400 })
  }

  // Call is.gd API
  const response = await fetch(`https://is.gd/create.php?format=json&url=${encodeURIComponent(url)}`)
  const data = await response.json()

  if (data.error) {
   return NextResponse.json({ error: data.error }, { status: 400 })
  }

  return NextResponse.json({ shorturl: data.shorturl })
 } catch (error) {
  console.error("Error shortening URL:", error)
  return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
 }
}
