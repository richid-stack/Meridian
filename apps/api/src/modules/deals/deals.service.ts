import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class DealsService {
  list(): never {
    // TODO(backend): implement per docs/API-CONTRACT.md
    throw new NotImplementedException('deals');
  }
}
