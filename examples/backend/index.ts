/**
 * Example of backend to test eslint, prettier.
 */

import { Injectable } from '@nestjs/common';

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
   * @returns Updated token price.
   */
  public calculateTokenPrice(currentPrice: number, volume: number, marketCap: number): number {
    const volumeRatio = volume / marketCap;
    const priceMultiplier = 1 + volumeRatio * 0.1;

    return currentPrice * priceMultiplier;
  }
}
