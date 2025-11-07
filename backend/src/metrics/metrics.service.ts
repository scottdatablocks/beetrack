import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MetricsService {
  constructor(private prisma: PrismaService) {}

  async getDecisionMetrics(tenantId?: string) {
    const where: any = {};
    if (tenantId) {
      where.tenantId = tenantId;
    }

    const alerts = await this.prisma.alert.findMany({
      where,
      include: {
        decisions: true,
      },
    });

    const totalAlerts = alerts.length;
    const totalDecisions = alerts.reduce(
      (sum, alert) => sum + alert.decisions.length,
      0,
    );

    // Calculate average decision time
    let totalDecisionTime = 0;
    let decisionsWithTime = 0;

    alerts.forEach((alert) => {
      alert.decisions.forEach((decision) => {
        if (decision.decidedAt) {
          const timeToDecision =
            decision.decidedAt.getTime() - alert.createdAt.getTime();
          totalDecisionTime += timeToDecision;
          decisionsWithTime++;
        }
      });
    });

    const avgDecisionTimeMinutes =
      decisionsWithTime > 0
        ? totalDecisionTime / decisionsWithTime / 1000 / 60
        : 0;

    // Calculate severity distribution
    const severityDistribution = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    alerts.forEach((alert) => {
      if (alert.severity) {
        severityDistribution[
          alert.severity as keyof typeof severityDistribution
        ]++;
      }
    });

    return {
      totalAlerts,
      totalDecisions,
      avgDecisionTimeMinutes: Math.round(avgDecisionTimeMinutes),
      severityDistribution,
      decisionRate:
        totalAlerts > 0 ? (totalDecisions / totalAlerts) * 100 : 0,
    };
  }

  async getVendorMetrics() {
    const vendors = await this.prisma.vendor.findMany();

    return vendors.map((vendor) => ({
      id: vendor.id,
      name: vendor.name,
      category: vendor.category,
      reliabilityScore: vendor.reliabilityScore,
      avgLeadTimeDays: vendor.avgLeadTimeDays,
      historicalDelays: vendor.historicalDelays,
      totalOrders: vendor.totalOrders,
      onTimeRate:
        vendor.totalOrders && vendor.totalOrders > 0
          ? ((vendor.totalOrders - (vendor.historicalDelays || 0)) /
              vendor.totalOrders) *
            100
          : 0,
    }));
  }

  async getProjectManagerMetrics(tenantId?: string) {
    const where: any = {};
    if (tenantId) {
      where.tenantId = tenantId;
    }

    const alerts = await this.prisma.alert.findMany({
      where,
      include: {
        project: true,
        decisions: true,
      },
    });

    // Group by project
    const projectStats: Record<string, any> = {};

    alerts.forEach((alert) => {
      const projectId = alert.project.id;
      if (!projectStats[projectId]) {
        projectStats[projectId] = {
          projectId,
          projectName: alert.project.name,
          alertCount: 0,
          decisionCount: 0,
          criticalAlerts: 0,
          totalRoiAtStake: 0,
        };
      }

      projectStats[projectId].alertCount++;
      projectStats[projectId].decisionCount += alert.decisions.length;
      if (alert.severity === 'critical') {
        projectStats[projectId].criticalAlerts++;
      }
      if (alert.roiAtStake) {
        projectStats[projectId].totalRoiAtStake += Number(alert.roiAtStake);
      }
    });

    return Object.values(projectStats);
  }

  async getSystemHealth() {
    const [
      totalAlerts,
      openAlerts,
      criticalAlerts,
      totalDecisions,
      recentAlerts,
    ] = await Promise.all([
      this.prisma.alert.count(),
      this.prisma.alert.count({ where: { status: 'open' } }),
      this.prisma.alert.count({
        where: { severity: 'critical', status: 'open' },
      }),
      this.prisma.decision.count(),
      this.prisma.alert.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
      }),
    ]);

    return {
      totalAlerts,
      openAlerts,
      criticalAlerts,
      totalDecisions,
      recentAlerts,
      status: criticalAlerts > 10 ? 'warning' : 'healthy',
    };
  }
}
