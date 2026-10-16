import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailModule } from 'src/mail/mail.module';
import { BloomFilter } from 'src/common/utils/bloom';

@Module({
  imports: [PrismaModule, MailModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: BloomFilter, useFactory: () => new BloomFilter(1000000) },
  ],
})
export class AuthModule {}
