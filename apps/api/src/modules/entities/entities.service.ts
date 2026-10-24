import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class EntitiesService {
  list(): never {
    // TODO(backend): implement per docs/API-CONTRACT.md
    throw new NotImplementedException('entities');
  }
}
