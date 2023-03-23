import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/helloauth')
  getHello1(@Req() request: Request ): string
  {
      return 'Hello ' + request['user'].uid + request['user'].phone;

  }

}
