'use client';

export type SiteEvent =
  | { name: 'service_selected'; serviceId: string }
  | { name: 'coverage_checked' }
  | { name: 'coverage_result'; matched: boolean; ambiguous: boolean; regionId?: string }
  | { name: 'contact_clicked'; channel: 'whatsapp' | 'phone'; placement: string }
  | { name: 'coverage_form_submitted' };

export function trackSiteEvent(event: SiteEvent) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<SiteEvent>('nexo:site-event', { detail: event }));
}
