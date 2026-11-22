/* =========================================================
   ONE-TIME SETUP: create the first Super Duper Admin account.

   Run from the server/ folder, in an interactive terminal
   (PowerShell, Command Prompt, VS Code terminal, macOS/Linux terminal):

     npm run bootstrap:super-duper-admin

   It asks for the password twice without showing it. The password is
   never accepted as a command-line argument or environment variable, so it
   doesn't end up in shell history or process listings. Only an Argon2id
   hash is stored.

   It works once. After it succeeds, running it again is refused, and
   further accounts are created in the staff app. The new account must
   change its password at first sign-in.

   Options: --username <name> (default: bologacbogac)
            --display-name "<name>" (default: Super Duper Admin)
   ========================================================= */
import { parseArgs } from 'node:util';
import { connectDb, disconnectDb } from '../src/db.js';
import { ensureIndexes } from '../src/models/index.js';
import { BootstrapError, bootstrapSuperDuperAdmin } from '../src/services/bootstrap.js';
import { BOOTSTRAP_PASSWORD_MIN_LENGTH } from '../src/auth/password.js';

const { values: args } = parseArgs({
  options: {
    username: { type: 'string', default: 'bologacbogac' },
    'display-name': { type: 'string', default: 'Super Duper Admin' },
  },
});

function fail(message) {
  console.error(`\n${message}`);
  process.exit(1);
}

/* Reads one line from the terminal without echoing what is typed. */
function askHidden(prompt) {
  return new Promise((resolve) => {
    const { stdin, stdout } = process;
    stdout.write(prompt);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    let value = '';
    const onData = (chunk) => {
      for (const ch of chunk) {
        if (ch === '\r' || ch === '\n') {
          stdin.setRawMode(false);
          stdin.pause();
          stdin.off('data', onData);
          stdout.write('\n');
          resolve(value);
          return;
        }
        if (ch === '\u0003') {
          // Ctrl+C
          stdin.setRawMode(false);
          stdout.write('\n');
          process.exit(130);
        }
        if (ch === '\u007f' || ch === '\b') value = value.slice(0, -1);
        else if (ch >= ' ') value += ch;
      }
    };
    stdin.on('data', onData);
  });
}

if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== 'function') {
  fail(
    'Run this command in an interactive terminal so the password can be typed privately.\n' +
      'In Git Bash on Windows, use PowerShell instead, or run: winpty npm.cmd run bootstrap:super-duper-admin',
  );
}

console.log('AT YOUR SERVICE: one-time Super Duper Admin setup');
console.log(`Username: ${args.username.trim().toLowerCase()}`);
console.log(`You'll change this password the first time you sign in (minimum ${BOOTSTRAP_PASSWORD_MIN_LENGTH} characters now).\n`);

const password = await askHidden('Password: ');
const confirm = await askHidden('Confirm password: ');
if (password !== confirm) fail('The passwords don’t match. Nothing was created.');

try {
  await connectDb();
  await ensureIndexes();
  const user = await bootstrapSuperDuperAdmin({ username: args.username, displayName: args['display-name'], password });
  console.log(`\nCreated Super Duper Admin account "${user.username}".`);
  console.log('Bootstrap is now disabled. Sign in to the staff app; you will be asked to choose a new password.');
} catch (err) {
  if (err instanceof BootstrapError) fail(`Not created: ${err.message}`);
  fail(`Not created: ${err.message}`);
} finally {
  await disconnectDb().catch(() => {});
}
