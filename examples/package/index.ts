/**
 * Validates Ethereum wallet address format.
 * @param address - Wallet address to validate.
 * @returns True if address is valid Ethereum format.
 * @example `isValidWalletAddress('0x123456789ABCDEF0123456789ABCDEF0123456789ABCDEF')`
 */
export function isValidWalletAddress(address: string): boolean {
  const ethereumRegex = /^0x[\dA-Fa-f]{40}$/;
  return ethereumRegex.test(address);
}
