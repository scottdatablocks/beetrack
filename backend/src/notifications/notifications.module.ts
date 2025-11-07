import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { TwilioModule } from '../integrations/twilio/twilio.module';
import { SlackModule } from '../integrations/slack/slack.module';

@Module({
  imports: [TwilioModule, SlackModule],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
