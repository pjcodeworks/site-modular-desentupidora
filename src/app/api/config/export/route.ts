import { requireSession } from '@/lib/auth';
import { exportDraftConfig } from '@/lib/config-store';

export async function GET() {
  try {
    await requireSession();
    return new Response(await exportDraftConfig(), {
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Content-Disposition': 'attachment; filename="configuracao-desentupidora.json"', 'Cache-Control': 'no-store' },
    });
  } catch {
    return new Response('Unauthorized', { status: 401 });
  }
}
