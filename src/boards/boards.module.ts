import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { BoardRepository } from './board.repository';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BoardRepository]), // board 엔티티를 컨트롤할 repository 등록
    AuthModule // 인증된 사용자만 게시판 사용하기 위해 import
  ],
  controllers: [BoardsController],
  providers: [BoardsService] // nest g controoler board --no-spce 으로 자동 등록
  // provider란 서비스, 리포지토리, 팩토리, 헬퍼 등의 Nest Class를 말함
})
export class BoardsModule {}
