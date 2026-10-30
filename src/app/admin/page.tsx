import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getDraftConfig, getPublishedConfig } from '@/lib/config-store';
import { logoutAction, publishAction, restoreAction } from './actions';
import { AdminEditor } from '@/components/admin/AdminEditor';
import { PublicationReadiness } from '@/components/admin/PublicationReadiness';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  const [draft, published] = await Promise.all([getDraftConfig(), getPublishedConfig()]);
  const hasDraftChanges = JSON.stringify({ ...draft, updatedAt: '' }) !== JSON.stringify({ ...published, updatedAt: '' });
  return <div className="admin-shell"><header className="admin-header"><a className="brand" href="/">Site modular</a><nav><a href="/?preview=draft" target="_blank">Pré-visualizar</a><form action={logoutAction}><button type="submit">Sair</button></form></nav></header><main className="admin-main"><div className="admin-hero"><div><h1>Configuração do site</h1><p>{hasDraftChanges ? 'Há alterações salvas em rascunho.' : 'O rascunho está alinhado à versão publicada.'}</p></div><div className="admin-actions"><form action={restoreAction}><button className="admin-button secondary" type="submit">Restaurar versão anterior</button></form><form action={publishAction}><button className="admin-button" type="submit">Publicar alterações</button></form></div></div><section className="admin-summary"><div className="summary-item"><span>Empresa</span><strong>{draft.company.displayName}</strong></div><div className="summary-item summary-logo"><span>Logo atual</span>{draft.company.logoUrl ? <img src={draft.company.logoUrl} alt="Logo atual" /> : <strong>Tipográfico</strong>}</div><div className="summary-item"><span>WhatsApp</span><strong>{draft.company.whatsapp}</strong></div><div className="summary-item"><span>Última atualização</span><strong>{new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Sao_Paulo' }).format(new Date(draft.updatedAt))}</strong></div></section><PublicationReadiness config={draft} /><div className="admin-grid"><aside className="admin-nav"><a href="#prontidao">Prontidão</a><a href="#identidade">Identidade</a><a href="#informacoes-verificadas">Informações verificadas</a><a href="#textos">Textos</a><a href="#aparencia">Aparência</a><a href="#servicos">Serviços</a><a href="#regioes">Regiões</a><a href="#seo">SEO</a><a href="#imagens">Imagens</a><a href="#transferencia">Importar/Exportar</a></aside><div><AdminEditor config={draft} /></div></div></main></div>;
}
