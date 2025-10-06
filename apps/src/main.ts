import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { setupSwagger } from './swagger';
import { AppModule } from './app.module';

import 'tsconfig-paths/register';

const GLOBAL_PREFIX = 'api';

async function bootstrap() {
  const adapter = new FastifyAdapter({ logger: true });
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter);

  app.enableVersioning({ type: VersioningType.URI });
  app.setGlobalPrefix(GLOBAL_PREFIX);

  setupSwagger(app);

  await app.listen(Number(process.env.PORT ?? 5000), '0.0.0.0');
}
bootstrap();
