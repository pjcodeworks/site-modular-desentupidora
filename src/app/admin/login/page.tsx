import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { LoginForm } from './LoginForm';

export default async function LoginPage() {
  if (await getSession()) redirect('/admin');
  return <main className="login-page"><section className="login-card"><a className="brand" href="/"><span>Site modular</span></a><h1>Área administrativa</h1><p>Use as credenciais configuradas no servidor. Nenhuma senha é enviada para o código público.</p><LoginForm /></section></main>;
}
