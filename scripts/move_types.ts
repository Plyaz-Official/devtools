import path from 'path';
import fs from 'fs';
import {
  Project,
  SourceFile,
  InterfaceDeclaration,
  TypeAliasDeclaration,
  EnumDeclaration,
  Node,
  SyntaxKind,
  ImportDeclarationStructure,
} from 'ts-morph';
import chalk from 'chalk';
import { showHelpAndExit } from '../utils/cli';

function parseArgs(argv: string[]) {
  const flags: Record<string, string | boolean> = {};
  let folder: string | undefined;

  for (const arg of argv) {
    if (arg.startsWith('--')) {
      const [key, val] = arg.replace(/^--/, '').split('=');
      flags[key] = val ?? true;
    } else if (!folder) {
      folder = arg;
    }
  }

  return { folder, flags };
}

const { folder: rootPath, flags } = parseArgs(process.argv.slice(2));
const reportPath = flags.report as string;
const onlyExported = Boolean(flags['only-exported']);
const dryRun = Boolean(flags['dry-run']);
const force = Boolean(flags.force);
const help = Boolean(flags.help);

if (!rootPath || help) {
  showHelpAndExit(
    chalk.bold.cyan(`
Usage: plyaz-move-types <folder> [options]

Options:
  --only-exported       Only move exported types/interfaces/enums
  --report=<path>       Path to write markdown report
  --dry-run             Simulate changes without modifying files
  --force               Overwrite conflicting types in types.ts
  --help                Show this help message
`)
  );
}

const project = new Project({ tsConfigFilePath: path.resolve('tsconfig.json') });

const typeDeclarations: Record<string, { name: string; text: string; node: Node; kind: string }[]> =
  {};

project.getSourceFiles(`${rootPath}/**/*.ts`).forEach(sourceFile => {
  const folder = path.dirname(sourceFile.getFilePath());
  const declarations = getTypeDeclarations(sourceFile);
  if (!declarations.length) return;
  if (!typeDeclarations[folder]) typeDeclarations[folder] = [];
  typeDeclarations[folder].push(...declarations);
});

function getTypeDeclarations(sourceFile: SourceFile) {
  const decls: { name: string; text: string; node: Node; kind: string }[] = [];
  sourceFile.forEachChild(stmt => {
    if (
      stmt instanceof InterfaceDeclaration ||
      stmt instanceof TypeAliasDeclaration ||
      stmt instanceof EnumDeclaration
    ) {
      const isExported = stmt.isExported();
      if (onlyExported && !isExported) return;

      const exportedText = isExported ? stmt.getText() : `export ${stmt.getText()}`;
      const kind =
        stmt instanceof InterfaceDeclaration
          ? 'interface'
          : stmt instanceof TypeAliasDeclaration
            ? 'type'
            : 'enum';

      decls.push({ name: stmt.getName(), text: exportedText, node: stmt, kind });
    }
  });
  return decls;
}

let movedTotal = 0;
let interfaceCount = 0;
let typeCount = 0;
let enumCount = 0;
const affectedFiles: { from: string; to: string; names: string[] }[] = [];

for (const folder in typeDeclarations) {
  const typesPath = path.join(folder, 'types.ts');
  const existingText = fs.existsSync(typesPath) ? fs.readFileSync(typesPath, 'utf-8') : '';
  const insertions: string[] = [];

  insertions.push(`// ========================================`);
  insertions.push(`// ======== From: ${path.relative(process.cwd(), folder)} ========`);
  insertions.push(`// ========================================\n`);

  const seen = new Set<string>();
  const importMap: Map<string, Set<string>> = new Map();
  const namesMoved: string[] = [];

  for (const { name, text, node, kind } of typeDeclarations[folder].sort((a, b) =>
    a.name.localeCompare(b.name)
  )) {
    if (
      existingText.includes(`interface ${name}`) ||
      existingText.includes(`type ${name}`) ||
      existingText.includes(`enum ${name}`)
    ) {
      if (!force) {
        console.warn(chalk.yellow(`⚠ Type ${name} already exists in ${typesPath}`));
        continue;
      }
    }

    const usedTypes = node.getDescendantsOfKind(SyntaxKind.Identifier).map(id => id.getText());
    const sourceImports = node.getSourceFile().getImportDeclarations();

    for (const importDecl of sourceImports) {
      const namedImports = importDecl.getNamedImports();
      const moduleSpecifier = importDecl.getModuleSpecifierValue();

      for (const namedImport of namedImports) {
        const importedName = namedImport.getName();
        if (usedTypes.includes(importedName)) {
          if (!importMap.has(moduleSpecifier)) {
            importMap.set(moduleSpecifier, new Set());
          }
          importMap.get(moduleSpecifier)?.add(importedName);
        }
      }
    }

    seen.add(name);
    namesMoved.push(name);
    insertions.push(text + '\n');

    movedTotal++;
    if (kind === 'interface') interfaceCount++;
    else if (kind === 'type') typeCount++;
    else if (kind === 'enum') enumCount++;
  }

  const importStatements = Array.from(importMap.entries()).map(
    ([mod, names]) => `import type { ${Array.from(names).sort().join(', ')} } from '${mod}';`
  );

  if (importStatements.length) {
    insertions.unshift(...importStatements, '');
  }

  if (!dryRun && insertions.length > 0) {
    fs.appendFileSync(typesPath, insertions.join('\n'));
  }

  if (insertions.length > 0) {
    affectedFiles.push({ from: folder, to: typesPath, names: namesMoved });
  }

  for (const { name, node } of typeDeclarations[folder]) {
    const sourceFile = node.getSourceFile();
    const importPath = './types';
    const existingImports = sourceFile
      .getImportDeclarations()
      .filter(i => i.getModuleSpecifierValue() === importPath);
    const alreadyHas = existingImports.some(decl =>
      decl.getNamedImports().some(imp => imp.getName() === name)
    );

    if (!alreadyHas) {
      const importDecl =
        existingImports[0] ?? sourceFile.addImportDeclaration({ moduleSpecifier: importPath });
      importDecl.set({ isTypeOnly: true } as ImportDeclarationStructure);
      importDecl.addNamedImport(name);
    }

    if (
      Node.isInterfaceDeclaration(node) ||
      Node.isTypeAliasDeclaration(node) ||
      Node.isEnumDeclaration(node)
    ) {
      node.remove();
    }

    if (!dryRun) {
      // Clean unused imports (if any were solely used in the removed types)
      const usedIdentifiers = sourceFile
        .getDescendantsOfKind(SyntaxKind.Identifier)
        .map(id => id.getText());
      const importDecls = sourceFile.getImportDeclarations();

      for (const decl of importDecls) {
        const namedImports = decl.getNamedImports();
        const unused = namedImports.filter(i => !usedIdentifiers.includes(i.getName()));
        unused.forEach(i => i.remove());

        if (decl.getNamedImports().length === 0) {
          decl.remove();
        }
      }

      sourceFile.saveSync();
    }
  }
}

console.log(chalk.green.bold(`\nSummary Report`));
console.log(`Affected files: ${affectedFiles.length}`);
console.log(`Types moved : ${movedTotal}`);
console.log(`- Interfaces: ${interfaceCount}`);
console.log(`- Types     : ${typeCount}`);
console.log(`- Enums     : ${enumCount}`);

if (reportPath) {
  const markdown = [
    `# Moved Types Report`,
    '',
    `**Affected files**: ${affectedFiles.length}`,
    `**Types moved**: ${movedTotal}`,
    `- Interfaces: ${interfaceCount}`,
    `- Types: ${typeCount}`,
    `- Enums: ${enumCount}`,
    '',
    ...affectedFiles.map(f =>
      [
        `### \`${path.relative(process.cwd(), f.from)}\``,
        `- ➕ ${f.names.length} types moved to \`${path.relative(process.cwd(), f.to)}\``,
        ...f.names.map(n => `  - ${n}`),
        '',
      ].join('\n')
    ),
  ].join('\n');

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, markdown);
  console.log(`\n📝 Markdown report written to ${chalk.magenta(reportPath)}`);
}
