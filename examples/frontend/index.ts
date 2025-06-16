/**
 * Example of frontend to test eslint, prettier.
 */

interface AthleteProfile {
  readonly id: string;
  readonly name: string;
  readonly tokenPrice: number;
}

/**
 * Calculates athlete token portfolio value.
 * @param athletes - Array of athlete profiles.
 * @param userTokens - User's token holdings.
 * @returns Total portfolio value in USD.
 * @example `calculatePortfolioValue([{ id: 'athlete1', name: 'Athlete 1', tokenPrice: 10 }], { tokenCount: 10 }]) => 100`
 */
export function calculatePortfolioValue(
  athletes: readonly AthleteProfile[],
  userTokens: Record<string, number>
): number {
  let totalValue = 0;

  for (const athlete of athletes) {
    const tokenCount = userTokens[athlete.id] ?? 0;
    totalValue += tokenCount * athlete.tokenPrice;
  }

  return totalValue;
}
