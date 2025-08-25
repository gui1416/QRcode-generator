import { NextResponse } from 'next/server';

export async function POST(request: Request) {
 try {
  const { url } = await request.json();

  const encodedUrl = encodeURIComponent(url);

  const response = await fetch(`https://is.gd/create.php?format=json&url=${encodedUrl}`);

  const data = await response.json();

  if (data.shorturl) {
   return NextResponse.json({ shrtlnk: data.shorturl });
  } else {
   return NextResponse.json({ error: data.errormessage || 'Failed to shorten URL' }, { status: 400 });
  }
 } catch (error: unknown) {
  console.error(error);
  const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
  return NextResponse.json({ error: errorMessage }, { status: 500 });
 }
}