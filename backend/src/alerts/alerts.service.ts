import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { RulesService } from '../rules/rules.service';

@Injectable()
export class AlertsService {
  constructor(
    private prisma: PrismaService,
    private rulesService: RulesService,
  ) {}

  async createAlert(createAlertDto: CreateAlertDto) {
    const { bufferPiercing, roiAtStake, severity, ...rest } = createAlertDto;

    // Auto-calculate severity if not provided
    const finalSeverity =
      severity ||
      this.rulesService.calculateSeverity(bufferPiercing || 0, roiAtStake || 0);

    return this.prisma.alert.create({
      data: {
        ...rest,
        bufferPiercing,
        roiAtStake,
        severity: finalSeverity,
      },
      include: {
        project: true,
        orderLine: true,
      },
    });
  }

  async getAlerts(status?: string, limit: number = 50) {
    const where = status ? { status } : {};

    return this.prisma.alert.findMany({
      where,
      include: {
        project: true,
        orderLine: true,
        tenant: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  async getAlertById(id: string) {
    const alert = await this.prisma.alert.findUnique({
      where: { id },
      include: {
        project: true,
        orderLine: true,
        tenant: true,
        decisions: true,
      },
    });

    if (!alert) {
      throw new NotFoundException(`Alert with ID ${id} not found`);
    }

    return alert;
  }

  async updateAlertStatus(id: string, status: string) {
    return this.prisma.alert.update({
      where: { id },
      data: { status },
    });
  }

  async getAlertsByProject(projectId: string) {
    return this.prisma.alert.findMany({
      where: { projectId },
      include: {
        orderLine: true,
        decisions: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getAlertsByTenant(tenantId: string, status?: string) {
    const where: any = { tenantId };
    if (status) {
      where.status = status;
    }

    return this.prisma.alert.findMany({
      where,
      include: {
        project: true,
        orderLine: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getCriticalAlerts(tenantId?: string) {
    const where: any = {
      severity: 'critical',
      status: 'open',
    };

    if (tenantId) {
      where.tenantId = tenantId;
    }

    return this.prisma.alert.findMany({
      where,
      include: {
        project: true,
        orderLine: true,
        tenant: true,
      },
      orderBy: {
        roiAtStake: 'desc',
      },
    });
  }
}
