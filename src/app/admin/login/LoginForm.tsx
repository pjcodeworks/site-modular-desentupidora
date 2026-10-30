'use client';

import { useActionState } from 'react';
import { loginAction } from '../actions';

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, { error: '' });
  return (
    <form action={action}>
      <div className="field"><label htmlFor="email">E-mail</label><input id="email" name="email" type="email" autoComplete="username" required /></div>
      <div className="field"><label htmlFor="password">Senha</label><input id="password" name="password" type="password" autoComplete="current-password" required /></div>
      {state.error && <p className="status-message error" role="alert">{state.error}</p>}
      <button className="admin-button" type="submit" disabled={pending}>{pending ? 'Entrando…' : 'Entrar no painel'}</button>
    </form>
  );
}
