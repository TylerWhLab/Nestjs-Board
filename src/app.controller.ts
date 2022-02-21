import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/HelloWorld')
  getHello(): string {

    // Response
    return this.appService.getHello();
    /* app.service.ts에서 가져온 AppService 클래스의 인스턴스내 getHello() method 호출
       service 내에서 로직 작성
    */

  }
}
