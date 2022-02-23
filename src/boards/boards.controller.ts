import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { stringify } from 'querystring';
import { BoardStatus } from './board-status.enum';
import { Board } from './board.entity';
import { BoardsService } from './boards.service'; // service
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('boards') // end point가 boards => 127.0.0.1:5555/boards/
@UseGuards(AuthGuard()) // 모든 핸들러에 인증 적용
/* AuthGuard() 는 @nestjs/passport 에서 가져온 것으로 2가지 기능 존재
    1. 토큰이 변조되면 401 error return 
    2. req 안에 user 정보를 넣을 수 있다.(jwt.stategy.ts에서 return user 했기 때문)
*/
export class BoardsController {

    private logger = new Logger('BoardController'); // 'BoardController'는 로그 상단에 찍을 내용
    
    constructor(private boardsService: BoardsService) { } // Dependency Injection, BoardsService가 type으로 들어가고, service를 controller에서 사용할 수 있게 해줌
    // js와 다르게 ts에서는 접근 제어자(private, public) 사용 가능
    // 생성자 안에서 접근제어자를 사용하면 인수인 파라미터가 암묵적으로 class property로 선언됨 => 생성자 밖에서 property 선언해둘 필요 없음
    // BoardsController 안에서만 사용하기 위해 private로 지정
    
    // 게시물 전체 SELECT
    @Get() // '/'와 동일, 컨트롤러 데코레이터에 boards가 있으므로 127.0.0.1:5555/boards/ request에 대한 handler
    getAllBoard(): Promise<Board[]> { // 핸들러, return type은 boards.model.ts
        return this.boardsService.getAllBoards();
    }

    // 특정 user 게시물만 SELECT
    @Get('/my')
    getBoardByUser(
        @GetUser() user: User
    ): Promise<Board[]> {
        this.logger.verbose(`User ${user.username} trying to get all boards`);
        return this.boardsService.getBoardByUser(user);
    }

    // 게시물 특정건 SELECT
    @Get('/:id')
    getBoardById(@Param('id') id: number): Promise <Board> { // @Param() params: string[] => 으로 여러 파라미터 접근
        return this.boardsService.getBoardById(id);
    }


    // 게시글 작성
    @Post()
    @UsePipes(ValidationPipe) // handler level pipe, dto에 넣은 validation check 기능으로 title, description만 IsNotEmpty 체크
    createBoard( // @Body() body // @Body() 데코레이터 안에 request body 전체가 들어있다.
        //@Body('title') title: string, // 파라미터 하나씩 받을 경우
        //@Body('description') description: string

        @Body() CreateBoardDto: CreateBoardDto, // 파라미터를 여기에 바로 쓰지 않고 dto에 작성하여 관리

        @GetUser() user: User // 커스텀 데코레이터로 user 정보 가져와 req에 넣는 기능을 가짐 // get-user.decorator.ts

    ): Promise <Board> {
        return this.boardsService.createBoard(CreateBoardDto, user);
    }



    // 게시글 삭제(자신이 생성한 게시글만)
    @Delete('/:id')
    deleteBoard(@Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    
    ): void { // ParseIntPipe => nest에서 지원하는 pipe로 typeof id == int인지 체크
        this.boardsService.deleteBoard(id, user);
    }
    // remove : 존재하지 않는 데이터를 삭제 시도 => 404 에러
    // delete : 존재하면 삭제, 아니면 nop


    // patch method : 리소스 일부 업데이트
    // put method : 리소스 전체 업데이트
    @Patch('/:id/status')
    updateBoardStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', BoardStatusValidationPipe) status: BoardStatus // BoardStatusValidationPipe 으로 status 파라미터 커스텀 validation
    ): Promise<Board> {
        return this.boardsService.updateBoardStatus(id, status);
    }

}
