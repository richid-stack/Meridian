import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { PrismaService } from '../../infra/prisma/prisma.service';

@Controller()
export class HealthController {
  constructor(private health: HealthCheckService, private prisma: PrismaService) {}

  @Get('health')
  live() {
    return { status: 'ok' };
  }

  @Get('ready')
  @HealthCheck()
  ready() {
    return this.health.check([
      async () => {
        await this.prisma.$queryRaw`SELECT 1`;
        return { database: { status: 'up' } };
      },
    ]);
  }
}
