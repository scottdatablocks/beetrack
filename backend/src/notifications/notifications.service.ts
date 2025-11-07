import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TwilioService } from '../integrations/twilio/twilio.service';
import { SlackService } from '../integrations/slack/slack.service';

export interface NotificationOptions {
  alertId: string;
  channel: 'sms' | 'slack' | 'email';
  recipient: string;
  alertDetails: {
    id: string;
    projectName: string;
    severity: string;
    roiAtStake: number;
    bufferPiercing: number;
  };
  decisionToken?: string;
  language?: string;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private prisma: PrismaService,
    private twilioService: TwilioService,
    private slackService: SlackService,
  ) {}

  async sendNotification(options: NotificationOptions): Promise<void> {
    const { channel, recipient, alertId, alertDetails, decisionToken, language } =
      options;

    let message = '';
    let status = 'pending';
    let errorMessage: string | undefined;

    try {
      if (channel === 'sms') {
        message = `Alert: ${alertDetails.severity} - ${alertDetails.projectName}`;
        await this.twilioService.sendAlertSms(
          recipient,
          alertDetails,
          decisionToken,
          language,
        );
        status = 'sent';
        this.logger.log(`SMS notification sent to ${recipient}`);
      } else if (channel === 'slack') {
        message = `Alert: ${alertDetails.severity} - ${alertDetails.projectName}`;
        await this.slackService.sendAlertMessage({
          channel: recipient,
          alertDetails,
          decisionToken,
        });
        status = 'sent';
        this.logger.log(`Slack notification sent to ${recipient}`);
      } else if (channel === 'email') {
        // Email integration would go here
        message = `Alert: ${alertDetails.severity} - ${alertDetails.projectName}`;
        this.logger.warn('Email notifications not yet implemented');
        status = 'pending';
      }
    } catch (error) {
      status = 'failed';
      errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Failed to send ${channel} notification to ${recipient}:`,
        error,
      );
    }

    // Log notification to database
    await this.prisma.notification.create({
      data: {
        alertId,
        channel,
        recipient,
        message,
        status,
        sentAt: status === 'sent' ? new Date() : null,
        errorMessage,
      },
    });
  }

  async sendAlertNotifications(
    alertId: string,
    alertDetails: any,
    recipients: { channel: string; recipient: string; language?: string }[],
    decisionToken?: string,
  ): Promise<void> {
    const promises = recipients.map((r) =>
      this.sendNotification({
        alertId,
        channel: r.channel as 'sms' | 'slack' | 'email',
        recipient: r.recipient,
        alertDetails,
        decisionToken,
        language: r.language,
      }),
    );

    await Promise.allSettled(promises);
  }

  async getNotificationsByAlert(alertId: string) {
    return this.prisma.notification.findMany({
      where: { alertId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getNotificationStats() {
    const [total, sent, failed, pending] = await Promise.all([
      this.prisma.notification.count(),
      this.prisma.notification.count({ where: { status: 'sent' } }),
      this.prisma.notification.count({ where: { status: 'failed' } }),
      this.prisma.notification.count({ where: { status: 'pending' } }),
    ]);

    return {
      total,
      sent,
      failed,
      pending,
      successRate: total > 0 ? (sent / total) * 100 : 0,
    };
  }
}
