import path from 'path';
import { fileURLToPath } from 'url';

import { presets } from './eslint/base.shared.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default presets.auto({
  tsconfigDir: __dirname,
  cssFilePath: './src/app/globals.css',
  tailwindConfig: './tailwind.config.js',
});
