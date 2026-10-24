import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from '@fastify/helmet';
import cookie from '@fastify/cookie';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { loadEnv } from './config/env.schema';

async function bootstrap() {
  const env = loadEnv(process.env);
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ trustProxy: true }), {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));
  app.setGlobalPrefix('v1', { exclude: ['health', 'ready'] });
  await app.register(helmet);
  await app.register(cookie);
  app.enableCors({ origin: env.CORS_ORIGINS.split(','), credentials: true });
  app.enableShutdownHooks();

  const doc = SwaggerModule.createDocument(
    app,
    new DocumentBuilder().setTitle('Meridian API').setVersion('0.1').addBearerAuth().build(),
  );
  SwaggerModule.setup('docs', app, doc);

  await app.listen(env.PORT, '0.0.0.0');
}
void bootstrap();
