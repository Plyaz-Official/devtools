import { execSync } from 'child_process';

if (process.platform !== 'win32') {
  execSync('chmod +x ./bin/*.sh && chmod +x ./bin/*.ts', { stdio: 'inherit' });
}
