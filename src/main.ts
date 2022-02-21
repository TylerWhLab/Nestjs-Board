import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';


// entry point
async function bootstrap() {
  const app = await NestFactory.create(AppModule); // app 생성, AppModule이 root module

  const serverConf = config.get('server');
  const port = serverConf.port;
  
  await app.listen(port); // app 실행, port 지정
  // console.log(`Nest Start ${port}`);
  Logger.log(`Application running on port ${port}`);
}
bootstrap();
