import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LiveService } from './live.service';

@ApiTags('live')
@Controller('live')
export class LiveController {
  constructor(private readonly service: LiveService) {}

  @Get()
  list() {
    return this.service.list();
  }
}
