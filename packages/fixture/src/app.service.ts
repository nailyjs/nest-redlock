import { RedlockService } from '@nailyjs.nest.modules/redlock';
import { Injectable, OnModuleInit } from '@nestjs/common';
import 'bluebird';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly redlockService: RedlockService) {}

  private readonly resource = 'test:resource';

  lockResource(ttl: number = 1000) {
    return this.redlockService.lock(this.resource, ttl);
  }

  checkResource() {
    return this.redlockService.acquire(this.resource, 10000);
  }

  async onModuleInit() {
    await this.lockResource(10000);
    console.log(await this.checkResource());
  }
}
