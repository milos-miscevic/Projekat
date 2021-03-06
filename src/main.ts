import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { StorageConfig } from 'config/storage.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(StorageConfig.photo.destination, {
    prefix: StorageConfig.photo.urlPrefix,
    maxAge: StorageConfig.photo.maxAge,
    index: false // ovo radimo da neko nebi neko prelistavao sadrzaj celog foldera
  });

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors(); // omogucavamo komunikaciju sa api-em

  await app.listen(3000);
}
bootstrap();
