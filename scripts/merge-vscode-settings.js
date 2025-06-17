#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve paths
const projectRoot = process.cwd();
const localSettingsPath = path.join(projectRoot, '.vscode/settings.json');
const sharedSettingsPath = path.join(__dirname, '..', 'vscode/settings.json');

// Read helpers
function readJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return {};
  }
}

const localSettings = readJSON(localSettingsPath);
const sharedSettings = readJSON(sharedSettingsPath);

// Merge: shared wins
const mergedSettings = {
  ...localSettings,
  ...sharedSettings,
};

// Ensure `.vscode/` exists
fs.mkdirSync(path.dirname(localSettingsPath), { recursive: true });

// Write merged settings
fs.writeFileSync(localSettingsPath, JSON.stringify(mergedSettings, null, 2));

console.log('✅ VSCode settings merged from @plyaz/devtools');
