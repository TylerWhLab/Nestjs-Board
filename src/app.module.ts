import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardsModule } from './boards/boards.module';
import { typeORMConfig } from './configs/typeorm.config';
import { AuthModule } from './auth/auth.module';

// Nest js module : @Module() 데코레이터로 주석이 달린 클래스
@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig), // typeORM 설정을 사용하기 위해 import
    BoardsModule, AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
