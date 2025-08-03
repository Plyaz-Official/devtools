/* eslint-disable max-depth */
import { Project, SyntaxKind, Node, type SourceFile } from 'ts-morph';
import path from 'path';
import fs from 'fs';
import { glob } from 'glob';
import chalk from 'chalk';
import { showHelpAndExit } from '../utils/cli';

showHelpAndExit(
  chalk.bold.cyan(`
Usage: plyaz-move-types [directory] [options]

Description:
  Moves exported type/interface/enum declarations to types.ts in each folder
  and adds "import type { ... } from './types'" back to original files.

Options:
  --report=<path>     Write a markdown report to the specified file
  --force             Overwrite conflicting declarations in types.ts
  --dry-run           Simulate actions without writing any files
  --help              Show this help message

Example:
  npx plyaz-move-types src/ --report=./internal-reports/move-types.md
`)
);

const args = process.argv.slice(2);
const inputPath = args.find(a => !a.startsWith('--'));
const reportArg = args.find(a => a.startsWith('--report='));
const reportPath = reportArg?.split('=')[1];
const dryRun = args.includes('--dry-run');
const forceOverwrite = args.includes('--force');

if (!inputPath) {
  console.error(chalk.red('✘ Please provide a path to scan'));
  throw new Error('✘ Please provide a path to scan');
}

const targetPath = path.resolve(inputPath);
const project = new Project({ tsConfigFilePath: path.resolve('tsconfig.json') });

const files = glob.sync(`${targetPath.replace(/\\/g, '/')}/**/*.{ts,tsx}`, {
  ignore: ['**/types.ts', '**/*.d.ts'],
});

if (files.length === 0) {
  console.log(chalk.gray('No matching TS files found.'));
  throw new Error('No matching TS files found.');
}

type DeclarationInfo = {
  name: string;
  text: string;
  kind: 'type' | 'interface' | 'enum';
  fromFile: string;
};

const movedByFolder: Record<string, { [fileName: string]: DeclarationInfo[] }> = {};
const affectedFiles: string[] = [];
let totalMoved = 0;

function getKind(node: Node): DeclarationInfo['kind'] | null {
  if (Node.isTypeAliasDeclaration(node)) return 'type';
  if (Node.isInterfaceDeclaration(node)) return 'interface';
  if (Node.isEnumDeclaration(node)) return 'enum';
  return null;
}

function parseExistingTypes(typesPath: string): SourceFile {
  return fs.existsSync(typesPath)
    ? project.addSourceFileAtPath(typesPath)
    : project.createSourceFile(typesPath, '', { overwrite: true });
}

for (const filePath of files) {
  const sourceFile = project.getSourceFile(filePath) ?? project.addSourceFileAtPath(filePath);
  const statements = sourceFile.getStatements();

  const toMove: DeclarationInfo[] = [];
  const relativeFileName = path.basename(filePath);
  const folder = path.dirname(filePath);

  for (const stmt of statements) {
    const kind = getKind(stmt);
    if (!kind) continue;

    const decl = stmt.asKindOrThrow(
      kind === 'type'
        ? SyntaxKind.TypeAliasDeclaration
        : kind === 'interface'
          ? SyntaxKind.InterfaceDeclaration
          : SyntaxKind.EnumDeclaration
    );

    if (!decl.hasModifier(SyntaxKind.ExportKeyword)) continue;

    const name = decl.getName?.();
    if (!name) continue;

    toMove.push({ name, text: decl.getText(), kind, fromFile: relativeFileName });
    if (!dryRun) decl.remove();
  }

  if (toMove.length === 0) continue;

  if (!movedByFolder[folder]) movedByFolder[folder] = {};
  movedByFolder[folder][relativeFileName] = toMove;
  affectedFiles.push(filePath);

  if (!dryRun) {
    sourceFile.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: './types',
      namedImports: toMove.map(t => t.name),
    });

    sourceFile.saveSync();
  }

  totalMoved += toMove.length;

  console.log(
    chalk.green(
      `${dryRun ? '🔎 Would move' : '✔ Moved'} ${toMove.length} from ${path.relative(process.cwd(), filePath)}:`
    )
  );
  toMove.forEach(t => console.log(`  - ${t.name} (${t.kind})`));
}

const reportLines: string[] = [];

for (const folder of Object.keys(movedByFolder).sort()) {
  const typesPath = path.join(folder, 'types.ts');
  const existingSource = parseExistingTypes(typesPath);
  const allNewGroups = movedByFolder[folder];
  const sortedFileNames = Object.keys(allNewGroups).sort((a, b) => a.localeCompare(b));

  let typesModified = false;

  for (const fileName of sortedFileNames) {
    const decls = allNewGroups[fileName];
    const header = `// ========= From: ${fileName} =========`;

    if (!existingSource.getFullText().includes(header)) {
      if (!dryRun) existingSource.addStatements(`\n${header}\n`);
    }

    for (const { name, text, kind } of decls) {
      const existing =
        kind === 'interface'
          ? existingSource.getInterface(name)
          : kind === 'enum'
            ? existingSource.getEnum(name)
            : existingSource.getTypeAlias(name);

      if (existing) {
        const existingText = existing.getText().replace(/\s/g, '');
        const newText = text.replace(/\s/g, '');
        if (existingText === newText) {
          continue; // identical, skip
        } else if (!forceOverwrite) {
          console.error(chalk.red(`❌ Conflict: ${name} (${kind}) already exists in ${typesPath}`));
          throw new Error(`Use --force to overwrite`);
        } else {
          console.log(chalk.yellow(`⚠ Overwriting conflicting ${name} in ${typesPath}`));
          if (!dryRun) existing.remove();
        }
      }

      if (!dryRun) {
        existingSource.addStatements(`\n${text}`);
        typesModified = true;
      }
    }

    reportLines.push(`### ${path.relative(process.cwd(), path.join(folder, fileName))}`);
    decls.forEach(d => {
      reportLines.push(`- ${d.name} (${d.kind})`);
    });
    reportLines.push('');
  }

  if (typesModified && !dryRun) {
    existingSource.saveSync();
  }
}

// === Final Report ===
console.log('\n' + chalk.bold.cyan('📊 Summary Report'));
console.log(chalk.cyan('------------------------'));
console.log(`Affected files: ${chalk.yellow(affectedFiles.length)}`);
console.log(`Types moved   : ${chalk.yellow(totalMoved)}${dryRun ? ' (dry-run)' : ''}\n`);

if (reportPath) {
  const markdown = [
    '# 📦 Type Migration Report',
    '',
    `**Total types moved**: ${totalMoved}`,
    `**Affected files**: ${affectedFiles.length}`,
    '',
    ...reportLines,
  ].join('\n');

  if (!dryRun) {
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, markdown, 'utf8');
    console.log(`📝 Markdown report written to ${chalk.magenta(reportPath)}\n`);
  } else {
    console.log(chalk.gray(`📝 (Dry-run mode: markdown not written)`));
  }
}
