/**
 * Example of frontend to test eslint, prettier.
 */

interface AthleteProfile {
  id: string;
  name: string;
  tokenPrice: number;
}

/**
 * Calculates athlete token portfolio value.
 * @param athletes - Array of athlete profiles.
 * @param userTokens - User's token holdings.
 * @returns Total portfolio value in USD.
 */
export function calculatePortfolioValue(
  athletes: AthleteProfile[],
  userTokens: Record<string, number>
): number {
  let totalValue = 0;

  for (const athlete of athletes) {
    const tokenCount = userTokens[athlete.id] ?? 0;
    totalValue += tokenCount * athlete.tokenPrice;
  }

  return totalValue;
}
