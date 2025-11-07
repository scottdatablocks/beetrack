import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebClient } from '@slack/web-api';
import axios from 'axios';

export interface SlackAlertOptions {
  channel?: string;
  alertDetails: {
    id: string;
    projectName: string;
    severity: string;
    roiAtStake: number;
    bufferPiercing: number;
  };
  decisionToken?: string;
}

@Injectable()
export class SlackService {
  private readonly logger = new Logger(SlackService.name);
  private client: WebClient | null = null;
  private webhookUrl: string | null = null;

  constructor(private configService: ConfigService) {
    const botToken = this.configService.get<string>('slack.botToken');
    this.webhookUrl = this.configService.get<string>('slack.webhookUrl') || null;

    if (botToken) {
      this.client = new WebClient(botToken);
      this.logger.log('Slack client initialized');
    } else {
      this.logger.warn(
        'Slack credentials not configured. Slack functionality will be disabled.',
      );
    }
  }

  async sendAlertMessage(options: SlackAlertOptions): Promise<void> {
    if (!this.client && !this.webhookUrl) {
      this.logger.warn('Slack not configured, skipping message');
      return;
    }

    const { alertDetails, decisionToken, channel = '#alerts' } = options;

    const severityEmoji = {
      critical: '🔴',
      high: '🟠',
      medium: '🟡',
      low: '🟢',
    };

    const emoji =
      severityEmoji[alertDetails.severity as keyof typeof severityEmoji] || '⚪';

    const blocks = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `${emoji} ${alertDetails.severity.toUpperCase()} Alert`,
          emoji: true,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Project:*\n${alertDetails.projectName}`,
          },
          {
            type: 'mrkdwn',
            text: `*Alert ID:*\n${alertDetails.id.substring(0, 8)}...`,
          },
          {
            type: 'mrkdwn',
            text: `*ROI at Risk:*\n$${alertDetails.roiAtStake.toLocaleString()}`,
          },
          {
            type: 'mrkdwn',
            text: `*Buffer Impact:*\n${(alertDetails.bufferPiercing * 100).toFixed(0)}%`,
          },
        ],
      },
    ];

    if (decisionToken) {
      const apiBaseUrl = this.configService.get<string>('api.baseUrl');
      blocks.push({
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '✅ Approve',
            },
            style: 'primary',
            url: `${apiBaseUrl}/decide/${decisionToken}?action=approve`,
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '❌ Reject',
            },
            style: 'danger',
            url: `${apiBaseUrl}/decide/${decisionToken}?action=reject`,
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '⬆️ Escalate',
            },
            url: `${apiBaseUrl}/decide/${decisionToken}?action=escalate`,
          },
        ],
      } as any);
    }

    try {
      if (this.webhookUrl) {
        await axios.post(this.webhookUrl, { blocks });
        this.logger.log('Alert sent via Slack webhook');
      } else if (this.client) {
        await this.client.chat.postMessage({
          channel,
          blocks,
          text: `${alertDetails.severity.toUpperCase()} Alert for ${alertDetails.projectName}`,
        });
        this.logger.log(`Alert sent to Slack channel: ${channel}`);
      }
    } catch (error) {
      this.logger.error('Failed to send Slack message:', error);
      throw error;
    }
  }

  async sendSimpleMessage(channel: string, text: string): Promise<void> {
    if (!this.client) {
      this.logger.warn('Slack not configured, skipping message');
      return;
    }

    try {
      await this.client.chat.postMessage({
        channel,
        text,
      });
      this.logger.log(`Message sent to Slack channel: ${channel}`);
    } catch (error) {
      this.logger.error('Failed to send Slack message:', error);
      throw error;
    }
  }

  isConfigured(): boolean {
    return this.client !== null || this.webhookUrl !== null;
  }
}
