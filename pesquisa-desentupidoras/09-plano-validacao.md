# 09 — Plano de validação antes do desenvolvimento

## Objetivo

Reduzir risco de construir módulos que parecem interessantes para quem vende o site, mas não ajudam o cliente final nem a equipe da desentupidora. Todas as validações são reversíveis e não exigem publicação ou automação real.

## Hipóteses e testes

| Hipótese | Método barato | Amostra inicial | Sinal de apoio | Sinal de revisão |
|---|---|---:|---|---|
| Triagem melhora a conversa inicial | protótipo + tarefas de urgência; comparar mensagem livre vs estruturada | 5–8 consumidores/simuladores + 2 atendentes | concluíram sem ajuda e atendente entende problema/local | abandonam, confundem ou mandam menos contexto útil |
| Proprietário percebe valor operacional | demo de 30s + entrevista com rotina real | 5–8 proprietários/gestores | aponta caso real e pede personalização | elogia visual mas não liga a uma rotina |
| Cobertura/processo aumenta confiança | teste A/B qualitativo de duas primeiras telas | 5–8 pessoas por rota, se possível | preferência explicada por clareza | não é notado ou cria dúvida |
| Rota B2B evita contatos ruins | protótipo de pedido comercial com síndico/restaurante | 3–5 por perfil | campos geram contexto realmente usado | dados não são usados no orçamento |
| Conteúdo técnico orienta sem travar | teste de compreensão de página de videoinspeção | 5 pessoas | explicam quando pedir avaliação | inferem preço/diagnóstico garantido |

## Roteiro de teste de emergência

1. “A água está voltando no vaso; encontre como pedir ajuda.”
2. Não ensinar o caminho. Registrar tempo, erros e se encontraram ligação/WhatsApp.
3. Pedir que expliquem o que acreditam que acontecerá depois do envio.
4. Perguntar o que ainda precisam saber antes de contatar.

Evitar conduzir a resposta e não apresentar uma promessa operacional falsa. Deixar claro que é um protótipo, não uma empresa disponível para atendimento.

## Indicadores e definição correta

| Indicador | O que mede | Não mede |
|---|---|---|
| Clique em WhatsApp/ligação | intenção de contato | lead qualificado, atendimento ou venda |
| Conclusão da triagem | capacidade de terminar o fluxo | satisfação com serviço executado |
| Campos completos úteis | qualidade inicial do contexto | conversão financeira |
| Tempo até primeiro retorno humano | operação de atendimento | eficácia isolada do site |
| Visita agendada/realizada | avanço comercial | receita sem confirmação de pagamento |
| Serviço fechado | venda registrada | margem, recorrência ou satisfação |
| Cancelamento/reclamação | possível desajuste de expectativa | causa isolada do problema |

## Instrumentação mínima de piloto

Eventos sugeridos: `view_emergency`, `select_service`, `coverage_started`, `coverage_completed`, `intake_started`, `intake_completed`, `whatsapp_opened`, `call_clicked`, `b2b_request_started`, `b2b_request_completed`. Antes de ativar analytics, definir consentimento, titular do dado, retenção e acesso.

No WhatsApp/CRM manual, registrar em planilha ou funil: origem, serviço, região, contato concluído, visita, orçamento enviado, orçamento aprovado, serviço realizado e motivo de perda. Não usar o conteúdo da mensagem como autorização automática para marketing.

## Sequência de quatro semanas (premissa: acesso a participantes)

| Semana | Ação | Decisão de saída |
|---|---|---|
| 1 | protótipo clicável e roteiro de entrevista | remover campos/mensagens confusas |
| 2 | 5–8 proprietários e 5–8 testes de consumidor | congelar MVP se há entendimento e valor operacional |
| 3 | piloto com uma empresa voluntária, sem automação | auditar qualidade dos contatos e operação |
| 4 | consolidar funil e custo de suporte | decidir integrar CRM/agenda ou iterar front |

Não há previsão de prazo de implementação implícita aqui: a agenda depende de recrutamento, acesso à operação e autorização para coletar dados.
