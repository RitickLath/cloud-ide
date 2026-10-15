import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './mail.service';
import mailConfig from '../config/mail.config';
import { BullModule } from '@nestjs/bullmq';
import { MailProcessor } from './mail.processor';

@Module({
  imports: [
    ConfigModule.forFeature(mailConfig),
    BullModule.registerQueue({
      name: 'send-email',
    }),
  ],

  providers: [MailService, MailProcessor],
  exports: [MailService],
})
export class MailModule {}
