import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';

@ApiTags('alerts')
@Controller('api/alerts')
export class AlertsController {
  constructor(private alertsService: AlertsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all alerts' })
  @ApiResponse({ status: 200, description: 'Returns all alerts' })
  async getAlerts(
    @Query('status') status?: string,
    @Query('limit') limit: string = '50',
  ) {
    return this.alertsService.getAlerts(status, parseInt(limit, 10));
  }

  @Get('critical')
  @ApiOperation({ summary: 'Get critical alerts' })
  @ApiResponse({ status: 200, description: 'Returns all critical alerts' })
  async getCriticalAlerts(@Query('tenant_id') tenantId?: string) {
    return this.alertsService.getCriticalAlerts(tenantId);
  }

  @Get('tenant/:tenantId')
  @ApiOperation({ summary: 'Get alerts by tenant' })
  @ApiResponse({ status: 200, description: 'Returns alerts for a tenant' })
  async getAlertsByTenant(
    @Param('tenantId') tenantId: string,
    @Query('status') status?: string,
  ) {
    return this.alertsService.getAlertsByTenant(tenantId, status);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get alerts by project' })
  @ApiResponse({ status: 200, description: 'Returns alerts for a project' })
  async getAlertsByProject(@Param('projectId') projectId: string) {
    return this.alertsService.getAlertsByProject(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get alert by ID' })
  @ApiResponse({ status: 200, description: 'Returns a single alert' })
  @ApiResponse({ status: 404, description: 'Alert not found' })
  async getAlertById(@Param('id') id: string) {
    return this.alertsService.getAlertById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new alert' })
  @ApiResponse({ status: 201, description: 'Alert created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async createAlert(@Body() createAlertDto: CreateAlertDto) {
    return this.alertsService.createAlert(createAlertDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update alert status' })
  @ApiResponse({ status: 200, description: 'Alert status updated' })
  @ApiResponse({ status: 404, description: 'Alert not found' })
  async updateAlertStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.alertsService.updateAlertStatus(id, status);
  }
}
