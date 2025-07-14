/* eslint-disable max-depth */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { glob } from 'glob';

const root = process.cwd();
const args = process.argv.slice(2);
const shouldRewrite = args.includes('--rewrite');
const reportArg = args.find(arg => arg.startsWith('--report='));
const reportPath = reportArg ? path.resolve(reportArg.split('=')[1]) : null;

type PkgJson = {
  name: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

type VersionUsage = Record<
  string,
  {
    versions: Record<string, string[]>; // version => [pkgNames]
    latestVersion: string;
  }
>;

function findHighestSemver(versions: string[]): string {
  const cleaned = versions.map(v => v.replace(/^[~^]/, ''));
  return cleaned.sort((a, b) => (a === b ? 0 : a > b ? -1 : 1))[0];
}

function loadPackageJson(filePath: string): PkgJson | null {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function writePackageJson(filePath: string, data: PkgJson): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
}

// Find all workspace package.json files
const workspacePkgFiles = glob.sync('{packages/*/package.json,apps/*/package.json}', {
  cwd: root,
  absolute: true,
});

if (workspacePkgFiles.length === 0) {
  console.warn(
    '⚠️ Skipped: Not a monorepo (no /packages or /apps folder found). This script is intended for monorepos.'
  );
  console.warn('➡️ Exiting without error.\n');
  // eslint-disable-next-line n/no-process-exit
  process.exit(0);
}

// Collect dependency versions across workspaces
const versionMap: VersionUsage = {};
const pkgLocations: Record<string, string> = {};

for (const pkgFile of workspacePkgFiles) {
  const pkg = loadPackageJson(pkgFile);
  if (!pkg?.name) continue;

  pkgLocations[pkg.name] = pkgFile;

  const sections: (keyof Pick<PkgJson, 'dependencies' | 'devDependencies' | 'peerDependencies'>)[] =
    ['dependencies', 'devDependencies', 'peerDependencies'];

  for (const section of sections) {
    const deps = pkg[section];
    if (!deps) continue;

    for (const [dep, version] of Object.entries(deps)) {
      if (!versionMap[dep]) {
        versionMap[dep] = { versions: {}, latestVersion: '' };
      }

      if (!versionMap[dep].versions[version]) {
        versionMap[dep].versions[version] = [];
      }

      versionMap[dep].versions[version].push(pkg.name);
    }
  }
}

// Resolve latest version per dependency
for (const dep of Object.keys(versionMap)) {
  const allVersions = Object.keys(versionMap[dep].versions);
  versionMap[dep].latestVersion = `^${findHighestSemver(allVersions)}`;
}

// CLI Summary
const PAD_END = 12;
let markdownOutput = `# 📦 Dependency Version Report\n\n`;

console.log('\n📦 Dependency Version Report:\n');

for (const dep of Object.keys(versionMap)) {
  const versions = versionMap[dep].versions;
  const latest = versionMap[dep].latestVersion;

  if (Object.keys(versions).length <= 1) continue;

  console.log(`🔧 ${dep}`);
  markdownOutput += `### 🔧 ${dep}\n`;

  for (const [ver, pkgs] of Object.entries(versions)) {
    const line = `  • ${ver.padEnd(PAD_END)} → used by: ${pkgs.join(', ')}`;
    console.log(line);
    markdownOutput += `- \`${ver}\` → used by: ${pkgs.join(', ')}\n`;
  }

  console.log(`  ✅ Suggested version: ${latest}\n`);
  markdownOutput += `- ✅ Suggested version: \`${latest}\`\n\n`;
}

if (reportPath) {
  try {
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, markdownOutput, 'utf8');
    console.log(`📄 Report saved to: ${reportPath}`);
  } catch (err) {
    console.error(`❌ Failed to write report: ${err}`);
  }
}

// Rewrite if needed
if (shouldRewrite) {
  console.log('\n✏️ Rewriting versions to latest...\n');

  for (const pkgFile of workspacePkgFiles) {
    const pkg = loadPackageJson(pkgFile);
    if (!pkg?.name) continue;

    let changed = false;

    for (const section of ['dependencies', 'devDependencies', 'peerDependencies'] as const) {
      const deps = pkg[section];
      if (!deps) continue;

      for (const dep of Object.keys(deps)) {
        const latestVersion = versionMap[dep]?.latestVersion;
        if (latestVersion && deps[dep] !== latestVersion) {
          deps[dep] = latestVersion;
          changed = true;
        }
      }
    }

    if (changed) {
      writePackageJson(pkgFile, pkg);
      console.log(`✅ Updated: ${pkg.name}`);
    }
  }

  console.log('\n📦 Installing updated packages...');
  try {
    execSync('pnpm install', { stdio: 'inherit' });
    console.log('✅ Done.');
  } catch {
    console.warn('\n⚠️ Failed to run pnpm install automatically.');
    console.warn('➡️ Please run it manually.\n');
  }
}
