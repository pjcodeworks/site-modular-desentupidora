'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { ServiceId, SiteConfig } from '@/lib/config-schema';
import { trackSiteEvent } from '@/lib/analytics';
import { buildWhatsAppUrl, findRegionCandidates } from '@/lib/site-utils';
import { InteractiveHouse } from './InteractiveHouse';
import { ServiceIcon } from './ServiceIcon';
import { VerifiedBusinessInfo } from './VerifiedBusinessInfo';

export function PublicSite({ config, preview = false }: { config: SiteConfig; preview?: boolean }) {
  const shellRef = useRef<HTMLDivElement>(null);
  const heroCtaRef = useRef<HTMLAnchorElement>(null);
  const finalCtaRef = useRef<HTMLElement>(null);
  const firstHouseService = config.services.find((service) => ['sink', 'toilet', 'drain', 'sewer'].includes(service.id) && service.enabled)?.id ?? 'sink';
  const [selected, setSelected] = useState<ServiceId>(firstHouseService);
  const [region, setRegion] = useState('');
  const [checked, setChecked] = useState(false);
  const [stickyContext, setStickyContext] = useState({ heroVisible: true, finalVisible: false });
  const regionCandidates = useMemo(() => checked ? findRegionCandidates(config, region) : [], [checked, config, region]);
  const matchedRegion = regionCandidates.length === 1 ? regionCandidates[0] : null;
  const ambiguousRegion = regionCandidates.length > 1;
  const selectedService = config.services.find((service) => service.id === selected);
  const whatsappUrl = buildWhatsAppUrl(config, selected, region);
  const themeStyle = { '--primary': config.theme.primary, '--accent': config.theme.accent, '--surface': config.theme.surface } as CSSProperties;
  const specialized = config.services.filter((service) => service.enabled && !['sink', 'toilet', 'drain', 'sewer'].includes(service.id));
  const regionOptions = [...new Set(config.regions.flatMap((item) => [item.name, ...item.aliases]))];
  const showMobileSticky = !stickyContext.heroVisible && !stickyContext.finalVisible;

  useEffect(() => {
    const root = shellRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const elements = root.querySelectorAll<HTMLElement>('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    root.classList.add('motion-ready');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const heroCta = heroCtaRef.current;
    const finalCta = finalCtaRef.current;
    if (!heroCta || !finalCta || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      setStickyContext((current) => {
        const next = { ...current };
        entries.forEach((entry) => {
          if (entry.target === heroCta) next.heroVisible = entry.isIntersecting;
          if (entry.target === finalCta) next.finalVisible = entry.isIntersecting;
        });
        return next;
      });
    }, { threshold: 0.2 });
    observer.observe(heroCta);
    observer.observe(finalCta);
    return () => observer.disconnect();
  }, []);

  function checkCoverage(event: React.FormEvent) {
    event.preventDefault();
    const candidates = findRegionCandidates(config, region);
    setChecked(true);
    trackSiteEvent({ name: 'coverage_form_submitted' });
    trackSiteEvent({ name: 'coverage_checked' });
    trackSiteEvent({ name: 'coverage_result', matched: candidates.length === 1, ambiguous: candidates.length > 1, regionId: candidates.length === 1 ? candidates[0].id : undefined });
  }

  function selectService(id: ServiceId) {
    setSelected(id);
    setChecked(false);
    trackSiteEvent({ name: 'service_selected', serviceId: id });
  }

  function navigateFromMobile(event: React.MouseEvent<HTMLAnchorElement>, targetId: string) {
    event.preventDefault();
    const target = document.querySelector<HTMLElement>(targetId);
    if (!target) return;
    target.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    window.history.pushState(null, '', targetId);
    event.currentTarget.closest('details')?.removeAttribute('open');
  }

  return (
    <div ref={shellRef} className={`site-shell font-${config.theme.fontPreset}`} style={themeStyle}>
      <a className="skip-link" href="#conteudo-principal">Pular para o conteúdo principal</a>
      {preview && <div className="preview-bar">Pré-visualização do rascunho: apenas administradores veem esta versão.</div>}
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label={`${config.company.displayName}, início`}>
          {config.company.logoUrl ? <img src={config.company.logoUrl} alt={config.company.displayName} /> : <><span>{config.company.displayName.split(' ')[0]}</span><em>{config.company.displayName.split(' ').slice(1).join(' ')}</em></>}
        </a>
        <nav aria-label="Navegação principal">
          <a href="#servicos">Serviços</a><a href="#como-funciona">Como funciona</a><a href="#cobertura">Cobertura</a><a href="#duvidas">Dúvidas</a>
        </nav>
        <div className="header-actions"><a className="button button-ghost" href={`tel:${config.company.phone.replace(/\D/g, '')}`} onClick={() => trackSiteEvent({ name: 'contact_clicked', channel: 'phone', placement: 'header' })}>Ligar</a><a className="button button-accent" href={whatsappUrl} target="_blank" rel="noreferrer" onClick={() => trackSiteEvent({ name: 'contact_clicked', channel: 'whatsapp', placement: 'header' })}>Falar no WhatsApp</a></div>
        <details className="mobile-menu"><summary aria-label="Abrir ou fechar menu"><span></span><span></span><span></span></summary><div><a href="#servicos" onClick={(event) => navigateFromMobile(event, '#servicos')}>Serviços</a><a href="#como-funciona" onClick={(event) => navigateFromMobile(event, '#como-funciona')}>Como funciona</a><a href="#cobertura" onClick={(event) => navigateFromMobile(event, '#cobertura')}>Cobertura</a><a href="#duvidas" onClick={(event) => navigateFromMobile(event, '#duvidas')}>Dúvidas</a></div></details>
      </header>

      <main id="conteudo-principal" tabIndex={-1}>
        <section className="hero" id="inicio">
          <div className="hero-copy">
            <span className="eyebrow"><i></i>{config.content.eyebrow}</span>
            <h1>{config.content.headline}</h1>
            <p>{config.content.subheadline}</p>
            <div className="hero-steps" aria-label="Etapas para contato"><span><b>01</b> Identifique</span><span><b>02</b> Confirme</span><span><b>03</b> Converse</span></div>
            <div className="hero-mobile-actions"><a ref={heroCtaRef} className="button button-accent" href={whatsappUrl} target="_blank" rel="noreferrer" onClick={() => trackSiteEvent({ name: 'contact_clicked', channel: 'whatsapp', placement: 'hero' })}>Falar no WhatsApp</a><a className="text-link" href={`tel:${config.company.phone.replace(/\D/g, '')}`} onClick={() => trackSiteEvent({ name: 'contact_clicked', channel: 'phone', placement: 'hero' })}>Ligar</a></div>
          </div>
          <InteractiveHouse config={config} selected={selected} onSelect={selectService} />
        </section>

        <section className="conversion-rail reveal" data-reveal id="cobertura" aria-labelledby="coverage-title">
          <div className="coverage-intro"><span className="section-index">01 · COBERTURA</span><h2 id="coverage-title">Confirme sua cobertura</h2><p>Informe seu endereço para a equipe confirmar.</p><span className="selection-summary" key={selected}>Ponto selecionado: <strong>{selectedService?.name ?? 'Selecione um serviço'}</strong></span></div>
          <form onSubmit={checkCoverage}>
            <label htmlFor="region"><span className="section-index">02 · ENDEREÇO</span>Informe sua região</label>
            <div className="input-row"><input id="region" list="region-options" autoComplete="address-level2" value={region} onChange={(e) => { setRegion(e.target.value); setChecked(false); }} placeholder="Cidade, bairro ou região" required /><button type="submit">Confirmar região</button></div>
            <datalist id="region-options">{regionOptions.map((option) => <option value={option} key={option} />)}</datalist>
          </form>
          <div className="contact-step"><span className="section-index">03 · CONTATO</span><h2>Fale com a equipe</h2><a className="button button-accent" href={whatsappUrl} target="_blank" rel="noreferrer" onClick={() => trackSiteEvent({ name: 'contact_clicked', channel: 'whatsapp', placement: 'coverage' })}>Falar no WhatsApp</a></div>
          {checked && <div className={`coverage-result ${matchedRegion ? 'is-covered' : ambiguousRegion ? 'is-ambiguous' : ''}`} role="status">{matchedRegion ? <><strong>{matchedRegion.name} está cadastrada.</strong> A equipe ainda confirmará disponibilidade e o próximo passo.</> : ambiguousRegion ? <><strong>Encontramos mais de uma possibilidade:</strong> {regionCandidates.map((item) => item.name).join(', ')}. Escolha uma sugestão ou consulte a equipe pelo WhatsApp.</> : <><strong>Não encontramos essa região na lista cadastrada.</strong> Você ainda pode consultar nossa equipe pelo WhatsApp.</>}</div>}
        </section>

        <VerifiedBusinessInfo config={config} />

        <section className="services-section" id="servicos">
          <div className="section-heading reveal" data-reveal><div><span className="eyebrow"><i></i>Serviços configurados</span><h2>Método adequado para cada situação.</h2></div><p>Somente os serviços habilitados no painel aparecem aqui. A indicação final depende da avaliação do caso.</p></div>
          <div className="service-grid">
            {specialized.map((service, index) => <article className="service-card reveal" data-reveal key={service.id}>
              {service.imageUrl && <div className="service-card__media"><Image src={service.imageUrl} alt={`${service.imageUrl.startsWith('/assets/services/') ? 'Ilustração técnica' : 'Imagem cadastrada'} de ${service.name}`} fill sizes="(max-width: 760px) calc(100vw - 36px), (max-width: 1100px) 50vw, 33vw" loading="lazy" decoding="async" />{service.imageUrl.startsWith('/assets/services/') && <span className="illustration-label">Ilustração técnica</span>}</div>}
              <div className="service-card__body"><div className="service-card__top"><span>{String(index + 1).padStart(2, '0')}</span><span className="service-card__icon"><ServiceIcon id={service.id} size={30} /></span></div><h3>{service.name}</h3><p>{service.description}</p><a href={buildWhatsAppUrl(config, service.id, region)} target="_blank" rel="noreferrer" onClick={() => trackSiteEvent({ name: 'contact_clicked', channel: 'whatsapp', placement: `service_${service.id}` })}>Solicitar avaliação <span>↗</span></a></div>
            </article>)}
          </div>
        </section>

        {config.media.heroUrl && <section className="editorial-media reveal" data-reveal><img src={config.media.heroUrl} alt="Imagem institucional configurada pela empresa" loading="lazy" decoding="async" /><div><span className="eyebrow eyebrow-dark"><i></i>Imagem institucional</span><h2>Uma operação real merece imagens reais.</h2><p>Este módulo usa o arquivo enviado no painel. Antes de publicar, confirme autoria, autorização de uso e correspondência com a equipe ou o equipamento da empresa.</p></div></section>}

        <section className="process-section" id="como-funciona">
          <div className="process-intro reveal" data-reveal><span className="eyebrow eyebrow-dark"><i></i>Como funciona</span><h2>Clareza antes de qualquer execução.</h2><p>{config.content.about}</p></div>
          <ol className="process-list"><li className="reveal" data-reveal><span>01</span><div><h3>Você explica</h3><p>Escolha o ponto e informe a região.</p></div></li><li className="reveal" data-reveal><span>02</span><div><h3>A equipe confirma</h3><p>Cobertura, contexto e próximo passo.</p></div></li><li className="reveal" data-reveal><span>03</span><div><h3>Avaliação</h3><p>O imóvel e a situação orientam o método.</p></div></li><li className="reveal" data-reveal><span>04</span><div><h3>Orçamento</h3><p>A execução depende da sua aprovação.</p></div></li></ol>
        </section>

        <section className="faq-section" id="duvidas">
          <div className="reveal" data-reveal><span className="eyebrow"><i></i>Dúvidas frequentes</span><h2>Informação direta, sem promessas vagas.</h2></div>
          <div className="faq-list reveal" data-reveal><details><summary>O desenho mostra a tubulação exata do meu imóvel?</summary><p>Não. A casa é uma representação ilustrativa para ajudar a identificar o ponto do problema. As instalações variam.</p></details><details><summary>A cobertura significa atendimento imediato?</summary><p>Não. Ela indica uma região cadastrada. A equipe ainda precisa confirmar disponibilidade e condições.</p></details><details><summary>É possível saber o valor pelo site?</summary><p>O site organiza o primeiro contato. A empresa deve avaliar o caso e apresentar o orçamento antes da execução.</p></details><details><summary>Preciso usar a casa interativa?</summary><p>Não. Você pode ligar ou abrir o WhatsApp diretamente a qualquer momento.</p></details></div>
        </section>

        <section ref={finalCtaRef} className="final-cta"><div className="final-cta__inner reveal" data-reveal><span className="eyebrow eyebrow-dark"><i></i>Vamos conversar?</span><h2>{config.content.finalCta}</h2><p>Envie o ponto do problema e a região para a equipe confirmar a cobertura e orientar o próximo passo.</p><div className="final-cta__actions"><a className="button button-light" href={whatsappUrl} target="_blank" rel="noreferrer" onClick={() => trackSiteEvent({ name: 'contact_clicked', channel: 'whatsapp', placement: 'final' })}>Falar no WhatsApp</a><a className="button button-outline-light" href={`tel:${config.company.phone.replace(/\D/g, '')}`} onClick={() => trackSiteEvent({ name: 'contact_clicked', channel: 'phone', placement: 'final' })}>Ligar para {config.company.phone}</a></div></div></section>
      </main>

      <footer><div className="footer-brand"><a className="brand brand-footer" href="#inicio"><span>{config.company.displayName}</span></a>{config.company.legalName && <span>{config.company.legalName}</span>}</div><p>As informações de atendimento e disponibilidade são confirmadas diretamente com a equipe.</p><div className="footer-business"><a href={`tel:${config.company.phone.replace(/\D/g, '')}`} onClick={() => trackSiteEvent({ name: 'contact_clicked', channel: 'phone', placement: 'footer' })}>{config.company.phone}</a>{config.company.email && <a href={`mailto:${config.company.email}`}>{config.company.email}</a>}{config.regions.length > 0 && <span>Regiões cadastradas: {config.regions.map((item) => item.name).join(', ')}</span>}<nav aria-label="Navegação do rodapé"><a href="#servicos">Serviços</a><a href="#cobertura">Cobertura</a></nav></div></footer>
      <a className={`mobile-sticky ${showMobileSticky ? 'is-visible' : ''}`} href={whatsappUrl} target="_blank" rel="noreferrer" tabIndex={showMobileSticky ? undefined : -1} aria-hidden={!showMobileSticky} onClick={() => trackSiteEvent({ name: 'contact_clicked', channel: 'whatsapp', placement: 'mobile_sticky' })}><span>WhatsApp: {selectedService?.name ?? 'falar com a equipe'}</span><span aria-hidden="true">↗</span></a>
    </div>
  );
}
