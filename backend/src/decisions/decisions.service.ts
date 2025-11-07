import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDecisionDto } from './dto/create-decision.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DecisionsService {
  constructor(private prisma: PrismaService) {}

  async recordDecision(token: string, userId: string, decisionType: string) {
    // Verify the token hasn't been used
    const existing = await this.prisma.decision.findUnique({
      where: { decisionToken: token },
    });

    if (existing) {
      throw new BadRequestException('Decision token has already been used');
    }

    const decision = await this.prisma.decision.create({
      data: {
        decisionToken: token,
        decidedBy: userId,
        decisionType,
        decidedAt: new Date(),
      },
    });

    return decision;
  }

  async createDecision(createDecisionDto: CreateDecisionDto) {
    return this.prisma.decision.create({
      data: {
        ...createDecisionDto,
        decidedAt: new Date(),
      },
    });
  }

  async getDecisions(limit: number = 50) {
    return this.prisma.decision.findMany({
      include: {
        alert: {
          include: {
            project: true,
          },
        },
      },
      orderBy: {
        decidedAt: 'desc',
      },
      take: limit,
    });
  }

  async getDecisionById(id: string) {
    const decision = await this.prisma.decision.findUnique({
      where: { id },
      include: {
        alert: {
          include: {
            project: true,
            tenant: true,
          },
        },
      },
    });

    if (!decision) {
      throw new NotFoundException(`Decision with ID ${id} not found`);
    }

    return decision;
  }

  async getDecisionByToken(token: string) {
    const decision = await this.prisma.decision.findUnique({
      where: { decisionToken: token },
      include: {
        alert: true,
      },
    });

    return decision;
  }

  async getDecisionsByAlert(alertId: string) {
    return this.prisma.decision.findMany({
      where: { alertId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  generateDecisionToken(): string {
    return uuidv4();
  }
}
