import { Board } from "src/boards/board.entity";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['username']) // DB 레벨에서 유니크한 값을 갖도록 지정, 이것만 지정하면 500 error(repository에서 try catch)
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    // type(Board)와 1:다 관계
    // board entity(table)에 접근하기 위해선 board.user로 접근해야 한다는 것을 명시, board entity에 user: User; 로 지정했기 때문
    // eager : true => user 정보 가져올 때, board 정보도 같이 가져옴
    @OneToMany(type => Board, board => board.user, { eager: true })
    boards: Board[] // board entity에서 여기로 접근할 때, boards로 접근해야 한다는 의미
}