/* Create an employee account, or reset an existing employee's password.

   Usage (from the server/ folder):
     npm run create-employee -- --email juan@atyourservice.com --name "Juan Dela Cruz" --role admin
     npm run create-employee -- --email juan@atyourservice.com --reset-password

   You'll be asked for the password (it isn't shown as you type).
   --role is "staff" (default) or "admin". */
import { parseArgs } from 'node:util';
import readline from 'node:readline';
import { connectDb, disconnectDb } from '../src/db.js';
import Employee from '../src/models/Employee.js';
import { hashPassword, MIN_PASSWORD_LENGTH } from '../src/lib/password.js';

const { values: args } = parseArgs({
  options: {
    email: { type: 'string' },
    name: { type: 'string' },
    role: { type: 'string', default: 'staff' },
    'reset-password': { type: 'boolean', default: false },
  },
});

function fail(message) {
  console.error(`Error: ${message}`);
  process.exit(1);
}

// Reads a line from the terminal without echoing it.
function askHidden(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (s) => { if (s.startsWith(question)) rl.output.write(s); };
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write('\n');
      resolve(answer);
    });
  });
}

async function getPassword() {
  // For automated setups only; typing it at the prompt is safer.
  if (process.env.EMPLOYEE_PASSWORD) return process.env.EMPLOYEE_PASSWORD;
  if (!process.stdin.isTTY) fail('Run this in a terminal so you can type the password.');
  const pw = await askHidden('Password: ');
  const again = await askHidden('Confirm password: ');
  if (pw !== again) fail('The passwords don’t match.');
  return pw;
}

const email = args.email?.trim().toLowerCase();
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) fail('Please pass a valid --email.');
if (!['staff', 'admin'].includes(args.role)) fail('--role must be "staff" or "admin".');

await connectDb();
try {
  const existing = await Employee.findOne({ email });
  if (existing && !args['reset-password']) fail(`${email} already has an account. Add --reset-password to change its password.`);
  if (!existing && args['reset-password']) fail(`No account found for ${email}.`);
  if (!existing && !args.name?.trim()) fail('Please pass --name for a new employee.');

  const password = await getPassword();
  if (password.length < MIN_PASSWORD_LENGTH) fail(`Passwords must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  const passwordHash = await hashPassword(password);

  if (existing) {
    await Employee.updateOne({ _id: existing._id }, { passwordHash });
    console.log(`Password updated for ${email}.`);
  } else {
    await Employee.create({ email, name: args.name.trim(), role: args.role, passwordHash });
    console.log(`Created ${args.role} account for ${args.name.trim()} <${email}>.`);
  }
} finally {
  await disconnectDb();
}
