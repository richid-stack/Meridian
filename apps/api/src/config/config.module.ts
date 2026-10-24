import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { loadEnv } from './env.schema';

@Module({
  imports: [NestConfigModule.forRoot({ isGlobal: true, validate: loadEnv })],
})
export class AppConfigModule {}
