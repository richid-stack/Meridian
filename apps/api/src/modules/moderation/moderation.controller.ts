import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ModerationService } from './moderation.service';

@ApiTags('moderation')
@Controller('moderation')
export class ModerationController {
  constructor(private readonly service: ModerationService) {}

  @Get()
  list() {
    return this.service.list();
  }
}
