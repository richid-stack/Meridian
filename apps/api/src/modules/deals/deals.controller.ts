import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DealsService } from './deals.service';

@ApiTags('deals')
@Controller('deals')
export class DealsController {
  constructor(private readonly service: DealsService) {}

  @Get()
  list() {
    return this.service.list();
  }
}
