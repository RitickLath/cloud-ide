import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import cookieParser from 'cookie-parser';

// Allow BigInt (e.g. from Prisma storageBytes) to be serialized in JSON.stringify
(BigInt.prototype as any).toJSON = function () {
  return Number(this) <= Number.MAX_SAFE_INTEGER
    ? Number(this)
    : this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  });

  app
    .setGlobalPrefix('api')
    .useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    )
    .enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
