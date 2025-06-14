/**
 * Example of package to test eslint, prettier.
 */

/**
 * Validates Ethereum wallet address format.
 * @param address - Wallet address to validate.
 * @returns True if address is valid Ethereum format.
 */
export function isValidWalletAddress(address: string): boolean {
  const ethereumRegex = /^0x[\dA-Fa-f]{40}$/;
  return ethereumRegex.test(address);
}
