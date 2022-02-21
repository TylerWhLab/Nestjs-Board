import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardStatus } from './board-status.enum';
// import { v1 as uuid } from 'uuid'; // 1 version 사용, DB 사용하지 않을 때 PK 설정
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardRepository } from './board.repository';
import { Board } from './board.entity';
import { User } from 'src/auth/user.entity';

@Injectable() // 이 데코레이터가 있으면 다른 컴포넌트에서 이 서비스를 이용할 수 있게(injectable) 만들어줌
export class BoardsService {
    
    constructor(
        // entity를 컨트롤하는 repository Dependency Injection
        @InjectRepository(BoardRepository)
        private boardRepository: BoardRepository,
    ){}

    // private boards: Board[] = []; // boards 배열의 type은 Boards.model.ts

    // 게시물 전체 SELECT
    async getAllBoards(): Promise<Board[]> { // method의 return type은 Boards.model.ts
        return this.boardRepository.find();
    }

    // 특정 user 게시물만 SELECT
    async getBoardByUser(
        user: User
    ): Promise<Board[]> {
        const query = this.boardRepository.createQueryBuilder('board');

        query.where('board.userId = :userId', { userId: user.id }); // Raw Query

        const boards = await query.getMany();

        return boards;
    }



    // 게시물 특정건 SELECT
    // https://typeorm.delightful.studio/classes/_repository_repository_.repository.html#findone
    async getBoardById(id: number): Promise <Board> { // Board Entity(Table)
        const found = await this.boardRepository.findOne(id); // SELECT * FROM boards WHERE ID = id;
        
        // 결과가 없을 경우 예외 처리(Response에 에러 문구 담기)
        if(!found) throw new NotFoundException(`${id} 유저를 찾을 수 없음`);
        
        return found; // return type이 Promise <Board>
    }


    // 게시글 생성
    createBoard(createBoardDto: CreateBoardDto, user: User): Promise<Board> {
        // const { title, description } = createBoardDto; // 사용할 parameter 가져오기

        // const board = this.boardRepository.create({
        //     title, // title: title, 과 동일
        //     description, // description: description, 과 동일
        //     status: BoardStatus.PUBLIC // 공개글
        // }) 
            
        // await this.boardRepository.save(board); // INSERT
        // return board;

        // repository에 로직 작성 => repository 패턴 적용
        return this.boardRepository.createBoard(createBoardDto, user);

    }

    // 게시글 삭제(자신이 생성한 게시글만)
    async deleteBoard(id: number, user: User): Promise<void> {
        const result = await this.boardRepository.delete( { id, user: user } ); // WHERE 조건이 2개 이상일 때 {}

        if(result.affected === 0) { // 삭제할 데이터가 없으면
            throw new NotFoundException(`${id} 없음`);
        }
    }

    // 게시글 공개/비공개 전환
    async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
        const board = await this.getBoardById(id);
        board.status = status;
        await this.boardRepository.save(board);

        return board;
    }

}
