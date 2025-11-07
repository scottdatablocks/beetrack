import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '🐝 BeeTrack Backend v3.0 - Constraint Relief Engine';
  }
}
