import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

const mimeByExtension: Record<string, string> = { '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };

export async function GET(_request: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  if (!/^[a-f0-9-]+\.(png|jpg|webp)$/.test(filename)) return new NextResponse('Not found', { status: 404 });
  const extension = path.extname(filename);
  try {
    const data = await readFile(path.join(process.cwd(), 'data', 'uploads', filename));
    return new NextResponse(data, { headers: { 'Content-Type': mimeByExtension[extension], 'Cache-Control': 'private, max-age=3600', 'X-Content-Type-Options': 'nosniff' } });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}
