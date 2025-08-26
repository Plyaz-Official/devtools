import { Project, SyntaxKind, type SourceFile } from 'ts-morph';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { showHelpAndExit } from '../utils/cli';

const START_FROM = 2;
const args = process.argv.slice(START_FROM);

showHelpAndExit(
  chalk.bold.cyan(`
Usage: plyaz-check-fnc [options]

Options:
  --remove-exported   Also remove exported but unused functions/classes/arrow-functions
  --report=<path>     Path to write the markdown report
  --help              Show this help message
`)
);

const reportPathArg = args.find(arg => arg.startsWith('--report='));
const allowExportedRemoval = args.includes('--remove-exported');

const reportPath =
  reportPathArg?.split('=')[1] ?? './internal-reports/unused-declarations-report.md';

const project = new Project({
  tsConfigFilePath: path.resolve('tsconfig.json'),
});

const declarations: Record<
  string,
  { filePath: string; kind: 'function' | 'class' | 'arrow-function'; isExported: boolean }
> = {};
const usedSymbols = new Set<string>();

function collectDeclarations(sourceFile: SourceFile): void {
  sourceFile.getFunctions().forEach(fn => {
    const name = fn.getName();
    if (!name) return;
    declarations[name] = {
      filePath: sourceFile.getFilePath(),
      kind: 'function',
      isExported: fn.hasModifier(SyntaxKind.ExportKeyword),
    };
  });

  sourceFile.getClasses().forEach(cls => {
    const name = cls.getName();
    if (!name) return;
    declarations[name] = {
      filePath: sourceFile.getFilePath(),
      kind: 'class',
      isExported: cls.hasModifier(SyntaxKind.ExportKeyword),
    };
  });

  sourceFile.getVariableStatements().forEach(stmt => {
    if (!stmt.isExported()) return;
    stmt.getDeclarations().forEach(decl => {
      const initializer = decl.getInitializer();
      const name = decl.getName();
      if (!name) return;

      if (initializer && initializer.getKind() === SyntaxKind.ArrowFunction) {
        declarations[name] = {
          filePath: sourceFile.getFilePath(),
          kind: 'arrow-function',
          isExported: true,
        };
      }
    });
  });
}

function markUsedSymbols(): void {
  for (const name of Object.keys(declarations)) {
    const { filePath, kind } = declarations[name];
    const sourceFile = project.getSourceFile(filePath);
    if (!sourceFile) continue;

    let node;
    if (kind === 'function') node = sourceFile.getFunction(name);
    else if (kind === 'class') node = sourceFile.getClass(name);
    else node = sourceFile.getVariableDeclaration(name);

    if (!node) continue;

    const refs = node.findReferences();
    const nonDefRefs = refs.flatMap(ref => ref.getReferences().filter(r => !r.isDefinition()));

    if (nonDefRefs.length > 0) {
      usedSymbols.add(name);
      continue;
    }
  }

  // Handle internal usage inside exported functions/variables
  project.getSourceFiles().forEach(sourceFile => {
    sourceFile.getFunctions().forEach(fn => {
      if (!fn.hasModifier(SyntaxKind.ExportKeyword)) return;
      fn.getDescendantsOfKind(SyntaxKind.Identifier).forEach(id => {
        const name = id.getText();
        if (declarations[name]) {
          usedSymbols.add(name);
        }
      });
    });

    sourceFile.getVariableStatements().forEach(stmt => {
      if (!stmt.isExported()) return;
      stmt.getDescendantsOfKind(SyntaxKind.Identifier).forEach(id => {
        const name = id.getText();
        if (declarations[name]) {
          usedSymbols.add(name);
        }
      });
    });
  });
}

function generateReport(): void {
  const used = Object.keys(declarations).filter(name => usedSymbols.has(name));
  const unused = Object.keys(declarations).filter(name => !usedSymbols.has(name));

  const unusedExported = unused.filter(name => declarations[name].isExported);
  const unusedNonExported = unused.filter(name => !declarations[name].isExported);

  console.log(chalk.blue('\n📄 Unused Declarations Report'));
  console.log(chalk.gray(`\nFound ${Object.keys(declarations).length} total symbols in project.`));
  console.log(
    `\n${chalk.green('✅ Used')}: ${used.length} | ${chalk.yellow('⚠️ Unused Exported')}: ${unusedExported.length} | ${chalk.red('❌ Unused Non-Exported')}: ${unusedNonExported.length}`
  );

  const lines: string[] = [];
  lines.push(`# Unused Declarations Report\n`);
  lines.push(`- Total: ${Object.keys(declarations).length}`);
  lines.push(`- ✅ Used: ${used.length}`);
  lines.push(`- ⚠️ Exported but unused: ${unusedExported.length}`);
  lines.push(`- ❌ Non-exported and unused: ${unusedNonExported.length}\n`);

  lines.push(`## ❌ Unused (non-exported)`);
  unusedNonExported.forEach(name => {
    const { filePath, kind } = declarations[name];
    lines.push(`- ${name} (${kind}) in \`${filePath}\``);
  });

  lines.push(`\n## ⚠️ Unused Exported`);
  unusedExported.forEach(name => {
    const { filePath, kind } = declarations[name];
    lines.push(`- ${name} (${kind}) in \`${filePath}\``);
  });

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, lines.join('\n'));

  console.log(chalk.gray(`\n📝 Report written to ${reportPath}`));

  // Optional removal
  if (allowExportedRemoval || unusedNonExported.length > 0) {
    console.log(chalk.yellow('\n🧹 Starting cleanup...'));
    function removeFunction(sourceFile: SourceFile, name: string): void {
      sourceFile.getFunction(name)?.remove();
    }

    function removeClass(sourceFile: SourceFile, name: string): void {
      sourceFile.getClass(name)?.remove();
    }

    function removeArrowFunction(sourceFile: SourceFile, name: string): void {
      sourceFile.getVariableDeclaration(name)?.remove();
    }

    function removeUnusedDeclaration(name: string): void {
      if (!allowExportedRemoval && declarations[name].isExported) return;
      const { filePath, kind } = declarations[name];
      const sourceFile = project.getSourceFile(filePath);
      if (!sourceFile) return;

      if (kind === 'function') removeFunction(sourceFile, name);
      else if (kind === 'class') removeClass(sourceFile, name);
      else removeArrowFunction(sourceFile, name);

      console.log(chalk.red(`❌ Removed ${name} from ${filePath}`));
    }

    [...unusedExported, ...unusedNonExported].forEach(removeUnusedDeclaration);

    project.saveSync();
  }
}

project
  .getSourceFiles(['src/**/*.ts', 'src/**/*.tsx', 'tests/**/*.ts', 'tests/**/*.tsx'])
  .forEach(collectDeclarations);

markUsedSymbols();
generateReport();
