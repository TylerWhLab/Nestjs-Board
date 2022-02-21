import { IsNotEmpty } from "class-validator";

export class CreateBoardDto {
    @IsNotEmpty() // validation check
    title: string;

    @IsNotEmpty()
    description: string;
}