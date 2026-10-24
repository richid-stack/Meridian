import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommunityService } from './community.service';

@ApiTags('community')
@Controller('community')
export class CommunityController {
  constructor(private readonly service: CommunityService) {}

  @Get()
  list() {
    return this.service.list();
  }
}
