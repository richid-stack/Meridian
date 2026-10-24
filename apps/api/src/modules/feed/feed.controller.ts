import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FeedService } from './feed.service';

@ApiTags('feed')
@Controller('feed')
export class FeedController {
  constructor(private readonly service: FeedService) {}

  @Get()
  list() {
    return this.service.list();
  }
}
