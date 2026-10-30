# 05 — Oportunidades de experiências digitais

## Princípio de seleção

Uma experiência só entra se reduzir incerteza para quem precisa contratar ou resolver uma etapa operacional para a empresa. Nota alta de “efeito visual” não equivale a valor. As tabelas abaixo distinguem recomendação de evidência.

| Módulo | Problema e público | Benefício para empresa / consumidor | Momento | Complexidade | Risco e evidência | Demo em 30s / reutilização |
|---|---|---|---|---|---|---|
| Triagem de problema | emergência residencial | contexto melhor / menos repetição | antes do contato | baixa | risco de formulário longo; padrão de WhatsApp/contato é observado | escolher sintoma e ver mensagem; campos configuráveis |
| Cobertura por endereço/bairro | todos | evita demanda inviável / expectativa clara | início | baixa/média | não prometer disponibilidade; Google recomenda área de serviço | digitar bairro e receber “confirmaremos”; lista/geo configurável |
| Foto/vídeo opcional | urgência e recorrência | pré-triagem / não precisa explicar tudo | contato | média | privacidade/upload; hipótese a testar | anexar e abrir WhatsApp; campo ativável |
| Processo de orçamento/aceite | todos | confiança / clareza | antes e depois do CTA | baixa | CDC apoia orçamento prévio | ver 4 etapas; texto e condições configuráveis |
| Rota condomínio/empresa | B2B | lead mais completo / solicitação adequada | hero e menu | baixa | não é prova de venda, mas responde à jornada distinta | preencher contexto; formulário por segmento |
| Galeria de equipamento/equipe | recorrente/B2B | autoridade / entendimento | depois da urgência | baixa | somente mídia real autorizada | trocar mídia e legenda; CMS de ativos |
| Videoinspeção explicada | recorrente/alto risco | valor técnico / entendimento de diagnóstico | página de serviço | baixa para conteúdo | só se serviço existir; referência setorial internacional | antes/depois autorizado; bloco de método |
| Agendamento de visita | planejado | organiza agenda / escolhe janela | B2B ou não urgente | média/alta | falha se não sincroniza rotina | escolher faixa e receber confirmação pendente |
| Painel de leads | equipe com processo | acompanhamento / resposta melhor | pós-MVP | média/alta | baixa adoção sem dono operacional | quadro simples; integração opcional |
| 3D de tubulação | demonstração técnica | diferenciação incerta / educação eventual | conteúdo secundário | alta | peso/performance e distração; sem evidência de conversão | animação curta; nunca na rota de urgência |

## Experiências de confiança recomendadas

1. **Processo visível:** “entendemos → confirmamos disponibilidade → avaliamos → apresentamos orçamento → você aprova → executamos.” A formulação precisa refletir a operação do cliente.
2. **Provas verificáveis:** CNPJ, áreas, horários, licenças, NF, condições de garantia, avaliações e fotos apenas quando o cliente fornecer evidência e aprovação.
3. **Explicação técnica simples:** quando faz sentido, mostrar o que videoinspeção/hidrojateamento procura e que método depende da avaliação. A videoinspeção pode localizar obstruções e apoiar escolha de intervenção menos invasiva. [Roto-Rooter](https://www.rotorooter.com/portland/sewer-video-inspection/)

## Não priorizar na primeira versão

- Calculadora de preço ou diagnóstico definitivo: o preço e a técnica dependem da vistoria/contexto; não devem virar cotação fictícia.
- Status de equipe em tempo real: requer localização, consentimento, escala e integração confiável.
- Chatbot que tenta resolver urgência sem rota para humano.
- 3D, vídeo em autoplay ou partículas no herói; não há justificativa comercial suficiente diante do risco de velocidade e distração.

## Guardrails de acessibilidade e velocidade

- Todo fluxo executável por teclado, com labels, mensagens de erro claras e foco visível.
- Imagem comprimida, vídeo sob demanda, fallback em texto e `prefers-reduced-motion`.
- Botão de ligação funciona como `tel:`; WhatsApp inclui resumo textual, sem depender de cor/ícone.
- Pedir o mínimo de dados; informar finalidade de anexos e não reter mídia sem política/infraestrutura definida.
