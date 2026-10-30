import bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';

const password = process.argv[2];

if (!password || password.length < 12) {
  console.error('Informe uma senha com pelo menos 12 caracteres.');
  console.error('Exemplo: pnpm setup:admin -- "minha-senha-forte"');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
const secret = randomBytes(48).toString('base64url');

console.log(`ADMIN_PASSWORD_HASH=${hash}`);
console.log(`SESSION_SECRET=${secret}`);
console.log('Copie as duas linhas para .env.local e defina também ADMIN_EMAIL.');
