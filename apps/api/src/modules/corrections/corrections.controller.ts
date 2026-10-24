import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CorrectionsService } from './corrections.service';

@ApiTags('corrections')
@Controller('corrections')
export class CorrectionsController {
  constructor(private readonly service: CorrectionsService) {}

  @Get()
  list() {
    return this.service.list();
  }
}
