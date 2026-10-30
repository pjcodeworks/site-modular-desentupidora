import type { SiteConfig } from '@/lib/config-schema';

export function VerifiedBusinessInfo({ config }: { config: SiteConfig }) {
  const info = config.verifiedInfo;
  if (!info.enabled) return null;

  const facts = [
    config.company.legalName && ['Nome legal', config.company.legalName],
    info.cnpj && ['CNPJ', info.cnpj],
    info.hours && ['Horário informado', info.hours],
    info.base && ['Base operacional', info.base],
    config.regions.length > 0 && ['Áreas cadastradas', config.regions.map((region) => region.name).join(', ')],
    info.paymentMethods && ['Meios de pagamento', info.paymentMethods],
    info.issuesInvoice && ['Nota fiscal', 'Emissão informada pela empresa'],
    info.warranties && ['Garantias informadas', info.warranties],
    info.licenses && ['Licenças informadas', info.licenses],
    info.insurance && ['Seguro informado', info.insurance],
  ].filter(Boolean) as [string, string][];
  const images = [
    config.media.teamUrl && [config.media.teamUrl, 'Equipe cadastrada pela empresa'],
    config.media.equipmentUrl && [config.media.equipmentUrl, 'Equipamento cadastrado pela empresa'],
  ].filter(Boolean) as [string, string][];

  if (!facts.length && !images.length && !info.reviewsLabel) return null;

  return (
    <section className="verified-info" aria-labelledby="verified-info-title">
      <div className="verified-info__heading reveal" data-reveal>
        <span className="eyebrow"><i></i>Informações verificadas</span>
        <h2 id="verified-info-title">Dados fornecidos pela empresa.</h2>
        <p>Este bloco mostra somente informações preenchidas no painel administrativo.</p>
      </div>
      {facts.length > 0 && <dl className="verified-info__facts">{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}
      {info.reviewsLabel && <div className="verified-info__reviews"><span>Avaliações</span>{info.reviewsSourceUrl ? <a href={info.reviewsSourceUrl} target="_blank" rel="noreferrer">{info.reviewsLabel} <span aria-hidden="true">↗</span></a> : <strong>{info.reviewsLabel}</strong>}</div>}
      {images.length > 0 && <div className="verified-info__media">{images.map(([src, alt]) => <figure key={src}><img src={src} alt={alt} loading="lazy" decoding="async" /><figcaption>Imagem fornecida pela empresa</figcaption></figure>)}</div>}
    </section>
  );
}
