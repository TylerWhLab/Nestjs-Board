// 커스텀 validation

import { BadRequestException, PipeTransform } from "@nestjs/common";
import { BoardStatus } from "../board-status.enum";

export class BoardStatusValidationPipe implements PipeTransform {

    // 클래스 외부에서 변경 불가
    readonly StatusOptions = [
        BoardStatus.PRIVATE,
        BoardStatus.PUBLIC
    ]

    transform(value: any){ // value = status 입력값
        // status가 body에 없을 때(공백 말고) 처리 추가 필요
        value = value.toUpperCase(); // 대문자로 변경하여 비교

        if(!this.isStatusValid(value)) {
            throw new BadRequestException(`${value} isn't in the status options`);
        }

        return value;
    }

    private isStatusValid(status: any) {
        const index = this.StatusOptions.indexOf(status);
        return index !== -1 // PRIVATE, PUBLIC 문자열이 입력값에 포함되어 있다면 return true
    }

}