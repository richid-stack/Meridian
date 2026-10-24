import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PortfolioService } from './portfolio.service';

@ApiTags('portfolio')
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly service: PortfolioService) {}

  @Get()
  list() {
    return this.service.list();
  }
}
