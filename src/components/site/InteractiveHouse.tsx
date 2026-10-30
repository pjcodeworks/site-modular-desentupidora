'use client';

import type { KeyboardEvent, ReactNode } from 'react';
import type { ServiceId, SiteConfig } from '@/lib/config-schema';
import { ServiceIcon } from './ServiceIcon';

const houseServices: ServiceId[] = ['sink', 'toilet', 'drain', 'sewer'];

export function InteractiveHouse({ config, selected, onSelect }: { config: SiteConfig; selected: ServiceId; onSelect: (id: ServiceId) => void }) {
  const services = config.services.filter((service) => houseServices.includes(service.id) && service.enabled);
  const active = config.services.find((service) => service.id === selected) ?? services[0];

  function selectFromKeyboard(event: KeyboardEvent<SVGGElement>, id: ServiceId) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(id);
    }
  }

  function hotspot(id: ServiceId, label: string, children: ReactNode) {
    const isActive = selected === id;
    return (
      <g className={`house-hotspot hotspot-${id} ${isActive ? 'is-active' : ''}`} role="button" tabIndex={0} aria-label={label} aria-pressed={isActive} onClick={() => onSelect(id)} onKeyDown={(event) => selectFromKeyboard(event, id)}>
        <title>{label}</title>
        {children}
      </g>
    );
  }

  return (
    <section className="house-card" aria-labelledby="house-title">
      <h2 id="house-title" className="sr-only">Casa interativa</h2>
      <div className="house-visual">
        <div className="house-card__topline"><span>Mapa hidráulico ilustrativo</span><span>Toque em um ponto</span></div>
        <div className={`house-illustration is-${selected}`}>
          <svg viewBox="0 0 820 470" role="img" aria-labelledby="house-svg-title house-svg-desc">
          <title id="house-svg-title">Corte técnico ilustrativo de uma residência</title>
          <desc id="house-svg-desc">Cozinha, banheiro, ralo e rede principal são selecionáveis. O trajeto destacado é apenas uma representação e varia em cada imóvel.</desc>
          <defs>
            <pattern id="micro-grid" width="18" height="18" patternUnits="userSpaceOnUse"><path d="M18 0H0V18" className="grid-line" /></pattern>
          </defs>
          <rect width="820" height="470" fill="url(#micro-grid)" />

          <g className="architecture">
            <path className="house-shell" d="M42 181 224 54l112 78 108-78 332 128M66 181v218h690V181M224 54h220M336 132v267M558 132v267" />
            <path className="house-line" d="M66 305h690M121 181v124M280 181v124M403 181v218M632 181v124M75 399h691M100 412h642" />
            <path className="detail-line" d="M94 205h154v80H94zM104 215h48v60h-48zM158 215h80v23h-80M158 248h80M177 181v25M447 204h76v21h-76zM535 204h78v101h-78zM648 205h78v100h-78zM650 241h74M586 204v101" />
            <path className="detail-line" d="M78 166h650M204 67v91M444 67v91M718 166v-8M81 399l-19 26M756 399l19 26" />
            <path className="dimension-line" d="M74 438h682M74 432v12M756 432v12M337 427v22" />
            <text className="dimension-text" x="202" y="453">COZINHA / ÁREA TÉCNICA</text>
            <text className="dimension-text" x="492" y="453">BANHEIRO / REDE PRINCIPAL</text>
          </g>

          <g className="room-labels" aria-hidden="true">
            <text x="92" y="198">COZINHA</text><text x="449" y="198">BANHEIRO</text><text x="642" y="198">ÁREA DE SERVIÇO</text>
          </g>

          <g className="fixtures">
            {hotspot('sink', 'Selecionar pia da cozinha', <>
              <rect className="hit-area" x="93" y="202" width="166" height="98" rx="8" />
              <path className="fixture" d="M164 223h73v14h-73zM171 237v24c0 11 8 19 18 19h23c10 0 18-8 18-19v-24M199 280v25M191 223v-16c0-13 22-13 22 0v5M213 212h12" />
              <circle className="fixture-detail" cx="201" cy="243" r="3" />
            </>)}
            {hotspot('toilet', 'Selecionar vaso sanitário', <>
              <rect className="hit-area" x="438" y="199" width="97" height="107" rx="8" />
              <path className="fixture" d="M458 215h47v38c0 19-10 33-24 33s-24-14-24-33zM451 215h61M461 286h40l8 19h-55z" />
              <path className="fixture-detail" d="M466 225h31v20c0 9-7 15-15 15s-15-6-15-15z" />
            </>)}
            {hotspot('drain', 'Selecionar ralo do banheiro', <>
              <rect className="hit-area" x="538" y="244" width="80" height="62" rx="8" />
              <path className="fixture" d="M553 264h49v24h-49zM561 270h33M561 277h33M570 264v24M586 264v24" />
            </>)}
            {hotspot('sewer', 'Selecionar rede principal de esgoto', <>
              <rect className="hit-area" x="66" y="338" width="690" height="87" rx="8" />
              <path className="sewer-node" d="M687 347h45v52h-45zM681 347h57M695 359h29M695 370h29M695 381h29" />
            </>)}
            <path className="fixture" d="M655 219h56v15h-56zM664 234v42h38v-42M682 219v-12M673 207h18" />
            <path className="fixture" d="M296 208h26v73h-26zM302 219h14M302 230h14M302 241h14" />
          </g>

          <g className="plumbing-base" aria-hidden="true">
            <path className="pipe-base" d="M201 280v50c0 12 10 22 22 22h73v48" />
            <path className="pipe-base" d="M482 286v66h-35v48" />
            <path className="pipe-base" d="M578 288v64h-36v48" />
            <path className="pipe-base" d="M223 352h464v48h45" />
            <path className="supply-line" d="M116 305v-71h48M426 305v-64h31M632 305v-70h23" />
          </g>
          <g className="plumbing-active" aria-hidden="true">
            <path className="pipe-active pipe-sink" pathLength="1" d="M201 280v50c0 12 10 22 22 22h464v48h45" />
            <path className="pipe-active pipe-toilet" pathLength="1" d="M482 286v66h205v48h45" />
            <path className="pipe-active pipe-drain" pathLength="1" d="M578 288v64h109v48h45" />
            <path className="pipe-active pipe-sewer" pathLength="1" d="M223 352h464v48h45" />
          </g>
          <g className="blueprint-notes" aria-hidden="true"><text x="84" y="330">AF 25 mm</text><text x="610" y="340">COLETOR ILUSTRATIVO</text><text x="684" y="420">SAÍDA</text></g>
          </svg>
          <span className="house-legend"><i></i> Trajeto selecionado</span>
        </div>
      </div>

      <div className="house-selection-panel">
        <div className="house-service-tabs" aria-label="Pontos do imóvel">
          {services.map((service) => (
            <button key={service.id} type="button" className={service.id === selected ? 'is-active' : ''} aria-pressed={service.id === selected} onClick={() => onSelect(service.id)}>
              <ServiceIcon id={service.id} size={24} /> <span>{service.name}</span>
            </button>
          ))}
        </div>

        {active && (
          <div className="house-explainer" key={active.id} aria-live="polite">
            <div className="service-number">{String(houseServices.indexOf(active.id) + 1).padStart(2, '0')}</div>
            <div><strong>{active.name}</strong><p>{active.description}</p></div>
          </div>
        )}
      </div>
    </section>
  );
}
