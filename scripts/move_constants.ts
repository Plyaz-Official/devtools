/* eslint-disable max-depth */
import { Project, VariableStatement, Node } from 'ts-morph';
import path from 'path';
import fs from 'fs';
import { glob } from 'glob';
import chalk from 'chalk';
import { showHelpAndExit } from '../utils/cli';

showHelpAndExit(
  chalk.bold.cyan(`
Usage: plyaz-move-consts [directory] [options]

Description:
  Moves exported const declarations to constants.ts in each folder
  and adds "import { ... } from './constants'" back to original files.

Options:
  --report=<path>     Write a markdown report to the specified file
  --force             Overwrite conflicting constants in constants.ts
  --dry-run           Simulate actions without writing any files
  --help              Show this help message

Example:
  npx plyaz-move-consts src/ --force --report=./internal-reports/move-consts.md
`)
);

const args = process.argv.slice(2);
const inputPath = args.find(a => !a.startsWith('--'));
const reportArg = args.find(a => a.startsWith('--report='));
const reportPath = reportArg?.split('=')[1];
const dryRun = args.includes('--dry-run');
const forceOverwrite = args.includes('--force');

if (!inputPath) throw new Error('✘ Please provide a path to scan');

const targetPath = path.resolve(inputPath);
const project = new Project({ tsConfigFilePath: path.resolve('tsconfig.json') });

const files = glob.sync(`${targetPath.replace(/\\/g, '/')}/**/*.{ts,tsx}`, {
  ignore: ['**/constants.ts', '**/*.d.ts'],
});

if (files.length === 0) {
  console.log(chalk.gray('No matching TS files found.'));
  throw new Error('No matching TS files found.');
}

type ConstInfo = {
  name: string;
  text: string;
  fromFile: string;
};

const movedByFolder: Record<string, { [fileName: string]: ConstInfo[] }> = {};
const affectedFiles: string[] = [];
let totalMoved = 0;

function getConstDeclarations(stmt: VariableStatement): ConstInfo[] {
  if (!stmt.isExported()) return [];
  if (stmt.getDeclarationKind() !== 'const') return [];

  return stmt.getDeclarations().map(decl => {
    const name = decl.getName();
    return { name, text: decl.getText(), fromFile: '' };
  });
}

for (const filePath of files) {
  const sourceFile = project.getSourceFile(filePath) ?? project.addSourceFileAtPath(filePath);
  const relativeFileName = path.basename(filePath);
  const folder = path.dirname(filePath);

  const constsToMove: ConstInfo[] = [];

  for (const stmt of sourceFile.getStatements()) {
    if (!Node.isVariableStatement(stmt)) continue;

    const consts = getConstDeclarations(stmt);
    consts.forEach(c => {
      c.fromFile = relativeFileName;
    });

    if (consts.length > 0 && !dryRun) stmt.remove();
    constsToMove.push(...consts);
  }

  if (constsToMove.length === 0) continue;

  if (!movedByFolder[folder]) movedByFolder[folder] = {};
  movedByFolder[folder][relativeFileName] = constsToMove;
  affectedFiles.push(filePath);

  if (!dryRun) {
    sourceFile.addImportDeclaration({
      isTypeOnly: false,
      moduleSpecifier: './constants',
      namedImports: constsToMove.map(t => t.name),
    });

    sourceFile.saveSync();
  }

  totalMoved += constsToMove.length;

  console.log(
    chalk.green(
      `${dryRun ? '🔎 Would move' : '✔ Moved'} ${constsToMove.length} from ${path.relative(process.cwd(), filePath)}:`
    )
  );
  constsToMove.forEach(c => console.log(`  - ${c.name}`));
}

const reportLines: string[] = [];

for (const folder of Object.keys(movedByFolder).sort()) {
  const constantsPath = path.join(folder, 'constants.ts');
  const existingSource = fs.existsSync(constantsPath)
    ? project.addSourceFileAtPath(constantsPath)
    : project.createSourceFile(constantsPath, '', { overwrite: true });

  const allGroups = movedByFolder[folder];
  const sortedFileNames = Object.keys(allGroups).sort();

  let modified = false;

  for (const fileName of sortedFileNames) {
    const decls = allGroups[fileName];
    const header = `// ========= From: ${fileName} =========`;

    if (!existingSource.getFullText().includes(header)) {
      if (!dryRun) existingSource.addStatements(`\n${header}\n`);
    }

    for (const { name, text } of decls) {
      const existingDecl = existingSource.getVariableDeclaration(name);

      if (existingDecl) {
        const currentText = existingDecl.getText().replace(/\s/g, '');
        const newText = text.replace(/\s/g, '');
        if (currentText === newText) {
          continue; // identical
        } else if (!forceOverwrite) {
          console.error(chalk.red(`❌ Conflict: const ${name} already exists in ${constantsPath}`));
          throw new Error(`Use --force to overwrite`);
        } else {
          console.log(chalk.yellow(`⚠ Overwriting conflicting const ${name} in ${constantsPath}`));
          if (!dryRun) existingDecl.remove();
        }
      }

      if (!dryRun) {
        existingSource.addStatements(`\n${text}`);
        modified = true;
      }
    }

    reportLines.push(`### ${path.relative(process.cwd(), path.join(folder, fileName))}`);
    decls.forEach(d => {
      reportLines.push(`- ${d.name}`);
    });
    reportLines.push('');
  }

  if (modified && !dryRun) {
    existingSource.saveSync();
  }
}

// === Final Report ===
console.log('\n' + chalk.bold.cyan('📊 Summary Report'));
console.log(chalk.cyan('------------------------'));
console.log(`Affected files: ${chalk.yellow(affectedFiles.length)}`);
console.log(`Consts moved   : ${chalk.yellow(totalMoved)}${dryRun ? ' (dry-run)' : ''}\n`);

if (reportPath) {
  const markdown = [
    '# 📦 Const Migration Report',
    '',
    `**Total constants moved**: ${totalMoved}`,
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
