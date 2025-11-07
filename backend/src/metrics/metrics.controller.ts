import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MetricsService } from './metrics.service';

@ApiTags('metrics')
@Controller('api/metrics')
export class MetricsController {
  constructor(private metricsService: MetricsService) {}

  @Get('decisions')
  @ApiOperation({ summary: 'Get decision metrics' })
  @ApiResponse({ status: 200, description: 'Returns decision metrics' })
  async getDecisionMetrics(@Query('tenant_id') tenantId?: string) {
    return this.metricsService.getDecisionMetrics(tenantId);
  }

  @Get('vendors')
  @ApiOperation({ summary: 'Get vendor performance metrics' })
  @ApiResponse({ status: 200, description: 'Returns vendor metrics' })
  async getVendorMetrics() {
    return this.metricsService.getVendorMetrics();
  }

  @Get('pms')
  @ApiOperation({ summary: 'Get project manager metrics' })
  @ApiResponse({ status: 200, description: 'Returns PM metrics' })
  async getProjectManagerMetrics(@Query('tenant_id') tenantId?: string) {
    return this.metricsService.getProjectManagerMetrics(tenantId);
  }

  @Get('health')
  @ApiOperation({ summary: 'Get system health metrics' })
  @ApiResponse({ status: 200, description: 'Returns system health' })
  async getSystemHealth() {
    return this.metricsService.getSystemHealth();
  }
}
