export function showHelpAndExit(helpText: string): void {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    console.log(helpText);
    process.exit(0);
  }
}
