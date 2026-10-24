import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MarketsService } from './markets.service';

@ApiTags('markets')
@Controller('markets')
export class MarketsController {
  constructor(private readonly service: MarketsService) {}

  @Get()
  list() {
    return this.service.list();
  }
}
