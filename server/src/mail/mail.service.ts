import { Inject, Injectable, Logger } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import mailConfig from '../config/mail.config';
import { getVerificationEmailTemplate } from './templates/verify-email.template';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter;

  constructor(
    @Inject(mailConfig.KEY)
    private mailConf: ConfigType<typeof mailConfig>,
    @InjectQueue('send-email')
    private readonly emailQueue: Queue,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.mailConf.host,
      port: this.mailConf.port,
      secure: this.mailConf.secure,
      auth: {
        user: this.mailConf.user,
        pass: this.mailConf.pass,
      },
    });
  }

  async queueVerificationEmail(
    email: string,
    token: string,
    username?: string,
  ) {
    await this.emailQueue.add(
      'verify-email',
      {
        email,
        token,
        username,
      },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
        removeOnComplete: true,
      },
    );
  }

  async sendVerificationEmail(
    email: string,
    token: string,
    username?: string,
  ): Promise<void> {
    const verifyUrl = `${this.mailConf.frontendUrl}/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`;
    const html = getVerificationEmailTemplate(verifyUrl, username);

    try {
      if (!this.mailConf.user || !this.mailConf.pass) {
        this.logger.warn(
          `[MailService] SMTP credentials not set. Simulated email verification link: ${verifyUrl}`,
        );
        return;
      }

      await this.transporter.sendMail({
        from: this.mailConf.from,
        to: email,
        subject: 'Verify your Cloud IDE Account',
        html,
      });

      this.logger.log(`Verification email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${email}`, error);
      throw error;
    }
  }
}
