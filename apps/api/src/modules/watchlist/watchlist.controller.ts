import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WatchlistService } from './watchlist.service';

@ApiTags('watchlist')
@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly service: WatchlistService) {}

  @Get()
  list() {
    return this.service.list();
  }
}
