import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClaimsService } from './claims.service';

@ApiTags('claims')
@Controller('claims')
export class ClaimsController {
  constructor(private readonly service: ClaimsService) {}

  @Get()
  list() {
    return this.service.list();
  }
}
