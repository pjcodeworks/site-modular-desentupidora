import type { SiteConfig } from '@/lib/config-schema';
import { getPublicationReadiness } from '@/lib/readiness';

const labels = { complete: 'Concluído', attention: 'Atenção necessária', optional: 'Opcional', blocking: 'Bloqueante' } as const;

export function PublicationReadiness({ config }: { config: SiteConfig }) {
  const items = getPublicationReadiness(config);
  return (
    <section className="admin-card readiness-card" id="prontidao">
      <h2>Prontidão para publicação</h2>
      <p>O checklist orienta a revisão da instalação. Itens opcionais não impedem a publicação.</p>
      <div className="readiness-list">{items.map((item) => <div className={`readiness-item is-${item.status}`} key={item.label}><div><strong>{item.label}</strong><p>{item.detail}</p></div><span>{labels[item.status]}</span></div>)}</div>
    </section>
  );
}
