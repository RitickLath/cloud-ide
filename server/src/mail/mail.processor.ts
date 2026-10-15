import { Processor, WorkerHost } from '@nestjs/bullmq';
import { MailService } from './mail.service';
import { Job } from 'bullmq';

@Processor('send-email')
export class MailProcessor extends WorkerHost {
  constructor(private mailService: MailService) {
    super();
  }

  async process(job: Job) {
    if (job.name === 'verify-email') {
      const { email, token, username } = job.data;
      await this.mailService.sendVerificationEmail(email, token, username);
    }
  }
}
