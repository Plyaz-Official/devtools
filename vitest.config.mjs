import { createVitestConfig } from './configs/vitest.config.mjs';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default createVitestConfig(__dirname);
