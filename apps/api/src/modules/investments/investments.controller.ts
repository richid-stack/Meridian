import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InvestmentsService } from './investments.service';

@ApiTags('investments')
@Controller('investments')
export class InvestmentsController {
  constructor(private readonly service: InvestmentsService) {}

  @Get()
  list() {
    return this.service.list();
  }
}
