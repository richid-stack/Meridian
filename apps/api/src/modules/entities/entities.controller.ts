import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EntitiesService } from './entities.service';

@ApiTags('entities')
@Controller('entities')
export class EntitiesController {
  constructor(private readonly service: EntitiesService) {}

  @Get()
  list() {
    return this.service.list();
  }
}
