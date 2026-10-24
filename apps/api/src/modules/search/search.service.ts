import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class SearchService {
  list(): never {
    // TODO(backend): implement per docs/API-CONTRACT.md
    throw new NotImplementedException('search');
  }
}
