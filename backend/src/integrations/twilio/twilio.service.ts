import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';

export interface SendSmsOptions {
  to: string;
  message: string;
  decisionToken?: string;
}

@Injectable()
export class TwilioService {
  private readonly logger = new Logger(TwilioService.name);
  private client: twilio.Twilio | null = null;
  private fromNumber: string;

  constructor(private configService: ConfigService) {
    const accountSid = this.configService.get<string>('twilio.accountSid');
    const authToken = this.configService.get<string>('twilio.authToken');
    this.fromNumber = this.configService.get<string>('twilio.phoneNumber') || '';

    if (accountSid && authToken) {
      this.client = twilio(accountSid, authToken);
      this.logger.log('Twilio client initialized');
    } else {
      this.logger.warn(
        'Twilio credentials not configured. SMS functionality will be disabled.',
      );
    }
  }

  async sendSms(options: SendSmsOptions): Promise<string | null> {
    if (!this.client) {
      this.logger.warn('Twilio not configured, skipping SMS');
      return null;
    }

    try {
      let body = options.message;

      // Add decision link if token provided
      if (options.decisionToken) {
        const apiBaseUrl = this.configService.get<string>('api.baseUrl');
        body += `\n\nDecide: ${apiBaseUrl}/decide/${options.decisionToken}`;
      }

      const message = await this.client.messages.create({
        body,
        from: this.fromNumber,
        to: options.to,
      });

      this.logger.log(`SMS sent to ${options.to}: ${message.sid}`);
      return message.sid;
    } catch (error) {
      this.logger.error(`Failed to send SMS to ${options.to}:`, error);
      throw error;
    }
  }

  async sendAlertSms(
    to: string,
    alertDetails: {
      projectName: string;
      severity: string;
      roiAtStake: number;
      bufferPiercing: number;
    },
    decisionToken?: string,
    language: string = 'en',
  ): Promise<string | null> {
    const messages: Record<string, string> = {
      en: `🚨 BeeTrack Alert: ${alertDetails.severity.toUpperCase()}\nProject: ${alertDetails.projectName}\nROI at Risk: $${alertDetails.roiAtStake.toLocaleString()}\nBuffer Impact: ${(alertDetails.bufferPiercing * 100).toFixed(0)}%`,
      es: `🚨 Alerta BeeTrack: ${alertDetails.severity.toUpperCase()}\nProyecto: ${alertDetails.projectName}\nROI en Riesgo: $${alertDetails.roiAtStake.toLocaleString()}\nImpacto en Buffer: ${(alertDetails.bufferPiercing * 100).toFixed(0)}%`,
      fr: `🚨 Alerte BeeTrack: ${alertDetails.severity.toUpperCase()}\nProjet: ${alertDetails.projectName}\nROI en Risque: $${alertDetails.roiAtStake.toLocaleString()}\nImpact Tampon: ${(alertDetails.bufferPiercing * 100).toFixed(0)}%`,
      de: `🚨 BeeTrack-Warnung: ${alertDetails.severity.toUpperCase()}\nProjekt: ${alertDetails.projectName}\nROI-Risiko: $${alertDetails.roiAtStake.toLocaleString()}\nPuffer-Auswirkung: ${(alertDetails.bufferPiercing * 100).toFixed(0)}%`,
      ja: `🚨 BeeTrack警告: ${alertDetails.severity.toUpperCase()}\nプロジェクト: ${alertDetails.projectName}\nリスクのあるROI: $${alertDetails.roiAtStake.toLocaleString()}\nバッファへの影響: ${(alertDetails.bufferPiercing * 100).toFixed(0)}%`,
    };

    const message = messages[language] || messages.en;

    return this.sendSms({
      to,
      message,
      decisionToken,
    });
  }

  isConfigured(): boolean {
    return this.client !== null;
  }
}
