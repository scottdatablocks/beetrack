import { Injectable } from '@nestjs/common';

export const BUFFER_TABLE = {
  mechanical: 1.5,
  electrical: 1.2,
  software: 2.0,
  sensors: 1.8,
  default: 1.5,
};

@Injectable()
export class RulesService {
  /**
   * Calculate Buffer Piercing™ score
   * Quantifies how much a delay impacts the project buffer
   * @param deltaDays - Number of days delayed
   * @param category - Part category (mechanical, electrical, etc.)
   * @param totalFloat - Total float days available
   * @returns Buffer piercing score (0-1, where 1 = critical)
   */
  calculateBufferPiercing(
    deltaDays: number,
    category: string,
    totalFloat: number = 0,
  ): number {
    if (deltaDays <= 0) return 0;

    const categoryBuffer =
      BUFFER_TABLE[category as keyof typeof BUFFER_TABLE] || BUFFER_TABLE.default;
    const normalizedFloat = Math.max(0, Math.min(1, totalFloat / categoryBuffer));
    const criticalPathWeight = Math.max(0.4, 1.0 - normalizedFloat);

    const bufferPiercing = (deltaDays / categoryBuffer) * criticalPathWeight;
    return Math.min(bufferPiercing, 1.0);
  }

  /**
   * Calculate ROI for expediting a part
   * @param daysSaved - Days that would be saved by expediting
   * @param dailyDelayCost - Cost per day of delay
   * @param expediteCost - Cost to expedite
   * @returns ROI value and percentage
   */
  calculateExpediteROI(
    daysSaved: number,
    dailyDelayCost: number,
    expediteCost: number,
  ): { roiValue: number; roiPct: number } {
    const grossBenefit = daysSaved * dailyDelayCost;
    const roiValue = grossBenefit - expediteCost;
    const roiPct = expediteCost > 0 ? (roiValue / expediteCost) * 100 : 0;

    return { roiValue, roiPct };
  }

  /**
   * Determine alert severity based on buffer piercing and ROI
   */
  calculateSeverity(bufferPiercing: number, roiAtStake: number): string {
    if (bufferPiercing >= 0.8 || roiAtStake >= 100000) return 'critical';
    if (bufferPiercing >= 0.5 || roiAtStake >= 50000) return 'high';
    if (bufferPiercing >= 0.3 || roiAtStake >= 25000) return 'medium';
    return 'low';
  }
}
