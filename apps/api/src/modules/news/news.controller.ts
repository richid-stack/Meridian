import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NewsService } from './news.service';

@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(private readonly service: NewsService) {}

  @Get()
  list() {
    return this.service.list();
  }
}
