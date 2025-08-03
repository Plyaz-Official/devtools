import { Project, SyntaxKind, type SourceFile } from 'ts-morph';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { showHelpAndExit } from '../utils/cli';

const args = process.argv.slice(2);

showHelpAndExit(
  chalk.bold.cyan(`
Usage: plyaz-check-types [options]

Options:
  --remove            Remove unused exported types/interfaces
  --report=<path>     Output markdown report to specified path
  --help              Show this help message
`)
);

const shouldRemove = args.includes('--remove');
const reportPathArg = args.find(arg => arg.startsWith('--report='));
const reportFilePath = reportPathArg?.split('=')[1];

const project = new Project({
  tsConfigFilePath: path.resolve('tsconfig.json'),
});

const typeDeclarations: Record<string, { filePath: string; kind: 'type' | 'interface' }> = {};
const usedTypes = new Set<string>();

function collectTypeDeclarations(sourceFile: SourceFile): void {
  sourceFile.getStatements().forEach(stmt => {
    const isInterface = stmt.isKind(SyntaxKind.InterfaceDeclaration);
    const isTypeAlias = stmt.isKind(SyntaxKind.TypeAliasDeclaration);

    if (!isInterface && !isTypeAlias) return;

    const name = stmt.getFirstChildByKind(SyntaxKind.Identifier)?.getText();
    const isExported = stmt.hasModifier(SyntaxKind.ExportKeyword);

    if (!name || !isExported) return;

    const kind = isInterface ? 'interface' : 'type';
    typeDeclarations[name] = {
      filePath: sourceFile.getFilePath(),
      kind,
    };
  });
}

// Collect all exported types and interfaces
project
  .getSourceFiles(['src/**/*.ts', 'src/**/*.tsx', 'tests/**/*.ts', 'tests/**/*.tsx'])
  .forEach(collectTypeDeclarations);

// Check for usages of these types across the codebase
for (const name of Object.keys(typeDeclarations)) {
  const { filePath, kind } = typeDeclarations[name];
  const sourceFile = project.getSourceFile(filePath);
  if (!sourceFile) continue;

  const declaration =
    kind === 'interface' ? sourceFile.getInterface(name) : sourceFile.getTypeAlias(name);

  if (!declaration) continue;

  const refs = declaration.findReferences();
  const nonDefRefs = refs.flatMap(ref => ref.getReferences().filter(r => !r.isDefinition()));

  if (nonDefRefs.length > 0) {
    usedTypes.add(name);
  }
}

// Report unused
const unused = Object.keys(typeDeclarations).filter(name => !usedTypes.has(name));

// === CLI Output ===
console.log(chalk.cyan.bold('\n📦 Unused Type Declarations Report\n'));
console.log(
  `Found ${chalk.green(Object.keys(typeDeclarations).length)} exported types/interfaces.`
);
console.log(`${chalk.red('✘')} Unused: ${chalk.red(unused.length)}\n`);

if (unused.length > 0) {
  unused.forEach(name => {
    const { kind, filePath } = typeDeclarations[name];
    console.log(`${chalk.yellow('•')} ${name} (${kind}) → ${chalk.gray(filePath)}`);
  });
}

// === Markdown Report ===
if (reportFilePath) {
  const lines: string[] = [];
  lines.push(`# 🧼 Unused Exported Types Report`);
  lines.push(``);
  lines.push(`**Total Exported Types:** ${Object.keys(typeDeclarations).length}`);
  lines.push(`**Unused Exported Types:** ${unused.length}`);
  lines.push(``);
  lines.push(`## 🔍 Unused Types`);
  lines.push(``);

  unused.forEach(name => {
    const { kind, filePath } = typeDeclarations[name];
    lines.push(`- \`${name}\` (${kind}) — \`${filePath}\``);
  });

  const dir = path.dirname(reportFilePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(reportFilePath, lines.join('\n'), 'utf8');
  console.log(chalk.magentaBright(`\n📝 Markdown report saved to: ${reportFilePath}\n`));
}

// === Optional Removal ===
if (shouldRemove && unused.length > 0) {
  console.log(chalk.gray('\n🧽 Cleaning unused types...\n'));

  unused.forEach(name => {
    const { filePath, kind } = typeDeclarations[name];
    const sourceFile = project.getSourceFile(filePath);
    if (!sourceFile) return;

    const declaration =
      kind === 'interface' ? sourceFile.getInterface(name) : sourceFile.getTypeAlias(name);

    if (declaration) {
      declaration.remove();
      console.log(`${chalk.red('✂️')} Removed ${name} from ${chalk.gray(filePath)}`);
    }
  });

  project.saveSync();
  console.log(chalk.greenBright('\n✅ Unused types removed and files saved.'));
}
