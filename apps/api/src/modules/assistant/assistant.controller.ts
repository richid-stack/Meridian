import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AssistantService } from './assistant.service';

@ApiTags('assistant')
@Controller('assistant')
export class AssistantController {
  constructor(private readonly service: AssistantService) {}

  @Get()
  list() {
    return this.service.list();
  }
}
