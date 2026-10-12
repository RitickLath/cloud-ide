import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DomainModule } from './domain/domain.module';
import { TerminalModule } from './terminal/terminal.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DomainModule,
    TerminalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
