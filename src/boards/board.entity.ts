import { User } from "src/auth/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BoardStatus } from "./board-status.enum";

@Entity() // CREATE TABLE
export class Board extends BaseEntity {
    @PrimaryGeneratedColumn() // PK
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: BoardStatus;

    // board : user = 다:1
    // eager : false => board 정보 가져올 때, user 정보는 가져오지 않음
    @ManyToOne(type => User, user => user.boards, { eager: false }) // Relation
    user: User; 
}