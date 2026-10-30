import type { ServiceId } from '@/lib/config-schema';

export function ServiceIcon({ id, size = 28 }: { id: ServiceId; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 32 32', fill: 'none', stroke: 'currentColor', strokeWidth: 1.55, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };
  if (id === 'sink') return <svg {...common}><path d="M4 11.5h24v3.7c0 5.7-4.6 10.3-10.3 10.3h-3.4C8.6 25.5 4 20.9 4 15.2zM16 25.5V29M10.5 29h11M10 11.5V7.8a3.8 3.8 0 0 1 7.6 0V9"/><path d="M18 9h3"/></svg>;
  if (id === 'toilet') return <svg {...common}><path d="M10 3.5h12v9.2a6 6 0 0 1-12 0zM8 3.5h16M11.5 19h9.4l2.7 9.5H9z"/><path d="M13 8.5h6M19.5 6.5h.1"/></svg>;
  if (id === 'drain') return <svg {...common}><rect x="4.5" y="4.5" width="23" height="23" rx="2"/><circle cx="16" cy="16" r="7"/><path d="M16 9v14M9 16h14M11 11l10 10M21 11 11 21"/></svg>;
  if (id === 'sewer' || id === 'external') return <svg {...common}><path d="M4 5v8.5A4.5 4.5 0 0 0 8.5 18H15v9M4 10h8M15 22h13M23.5 18v9"/><circle cx="4" cy="5" r="2"/><path d="M8 24h7"/></svg>;
  if (id === 'hydrojet') return <svg {...common}><path d="M3 16h8l5-5v10l-5-5M19 16h10M23 11l6 5-6 5"/><path d="M20 12l3-3M20 20l3 3"/></svg>;
  if (id === 'camera') return <svg {...common}><rect x="4" y="8" width="20" height="16" rx="3"/><circle cx="14" cy="16" r="5"/><circle cx="14" cy="16" r="2"/><path d="M24 13l5-3v12l-5-3M8 5h8"/></svg>;
  return <svg {...common}><path d="M5 4v8.5a5.5 5.5 0 0 0 5.5 5.5h10a5.5 5.5 0 0 1 5.5 5.5V28"/><path d="M2 8h6M23 24h6M10 14h7"/></svg>;
}
