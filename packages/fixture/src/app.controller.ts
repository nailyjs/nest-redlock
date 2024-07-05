import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('lock')
  lock() {
    return this.appService.lockResource();
  }

  @Get('check')
  check() {
    return this.appService.checkResource();
  }
}
