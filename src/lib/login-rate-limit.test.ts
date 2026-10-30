import { describe, expect, it } from 'vitest';
import { clearLoginFailures, isLoginBlocked, registerLoginFailure } from './login-rate-limit';

describe('login rate limit', () => {
  it('blocks after five failures and libera apos a janela', () => {
    const start = 1_000_000;
    for (let attempt = 0; attempt < 4; attempt += 1) registerLoginFailure('ip-a', start);
    expect(isLoginBlocked('ip-a', start)).toBe(false);
    registerLoginFailure('ip-a', start);
    expect(isLoginBlocked('ip-a', start)).toBe(true);
    expect(isLoginBlocked('ip-a', start + 16 * 60 * 1000)).toBe(false);
  });

  it('isola chaves e limpa no login bem-sucedido', () => {
    const start = 2_000_000;
    for (let attempt = 0; attempt < 5; attempt += 1) registerLoginFailure('ip-b', start);
    expect(isLoginBlocked('ip-b', start)).toBe(true);
    expect(isLoginBlocked('ip-c', start)).toBe(false);
    clearLoginFailures('ip-b');
    expect(isLoginBlocked('ip-b', start)).toBe(false);
  });
});
