import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RulesModule } from './rules/rules.module';
import { AlertsModule } from './alerts/alerts.module';
import { DecisionsModule } from './decisions/decisions.module';
import { MetricsModule } from './metrics/metrics.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TwilioModule } from './integrations/twilio/twilio.module';
import { SlackModule } from './integrations/slack/slack.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrismaModule,
    RulesModule,
    AlertsModule,
    DecisionsModule,
    MetricsModule,
    NotificationsModule,
    TwilioModule,
    SlackModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
