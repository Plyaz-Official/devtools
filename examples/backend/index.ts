//  Example of backend to test eslint, prettier.

import { Injectable } from '@nestjs/common';

const RATIO = 0.1; // Adjustable ratio for price increase based on trading volume.

/**
 * Service for calculating athlete token prices.
 */
@Injectable()
export class TokenPriceService {
  /**
   * Calculates new token price based on market demand.
   * @param currentPrice - Current token price.
   * @param volume - Trading volume in last 24h.
   * @param marketCap - Total market capitalization.
   * @returns {number} Updated token price.
   * @example `calculateTokenPrice(100, 1000000, 1000000000000)` returns 101.
   */
  public calculateTokenPrice(currentPrice: number, volume: number, marketCap: number): number {
    const volumeRatio = volume / marketCap;
    const priceMultiplier = 1 + volumeRatio * RATIO;

    return currentPrice * priceMultiplier;
  }
}
