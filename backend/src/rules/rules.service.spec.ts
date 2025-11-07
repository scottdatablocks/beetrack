import { Test, TestingModule } from '@nestjs/testing';
import { RulesService } from './rules.service';

describe('RulesService', () => {
  let service: RulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RulesService],
    }).compile();

    service = module.get<RulesService>(RulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateBufferPiercing', () => {
    it('should return 0 for no delay', () => {
      const result = service.calculateBufferPiercing(0, 'mechanical', 0);
      expect(result).toBe(0);
    });

    it('should calculate buffer piercing for mechanical parts', () => {
      const result = service.calculateBufferPiercing(7, 'mechanical', 0);
      // 7 days / 1.5 buffer * 1.0 weight = 4.67, capped at 1.0
      expect(result).toBeCloseTo(1.0, 1);
    });

    it('should calculate buffer piercing with float', () => {
      const result = service.calculateBufferPiercing(3, 'mechanical', 2);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(1);
    });

    it('should use default buffer for unknown category', () => {
      const result = service.calculateBufferPiercing(3, 'unknown', 0);
      expect(result).toBeGreaterThan(0);
    });
  });

  describe('calculateExpediteROI', () => {
    it('should calculate positive ROI', () => {
      const result = service.calculateExpediteROI(7, 15000, 1200);
      expect(result.roiValue).toBe(103800);
      expect(result.roiPct).toBeCloseTo(8650, 0);
    });

    it('should calculate negative ROI', () => {
      const result = service.calculateExpediteROI(1, 5000, 10000);
      expect(result.roiValue).toBe(-5000);
      expect(result.roiPct).toBe(-50);
    });

    it('should handle zero expedite cost', () => {
      const result = service.calculateExpediteROI(7, 15000, 0);
      expect(result.roiValue).toBe(105000);
      expect(result.roiPct).toBe(0);
    });
  });

  describe('calculateSeverity', () => {
    it('should return critical for high buffer piercing', () => {
      const severity = service.calculateSeverity(0.85, 50000);
      expect(severity).toBe('critical');
    });

    it('should return critical for high ROI at stake', () => {
      const severity = service.calculateSeverity(0.3, 120000);
      expect(severity).toBe('critical');
    });

    it('should return high for moderate values', () => {
      const severity = service.calculateSeverity(0.6, 60000);
      expect(severity).toBe('high');
    });

    it('should return medium for lower values', () => {
      const severity = service.calculateSeverity(0.35, 30000);
      expect(severity).toBe('medium');
    });

    it('should return low for minimal impact', () => {
      const severity = service.calculateSeverity(0.2, 10000);
      expect(severity).toBe('low');
    });
  });
});
