/*
model은 아래 2곳 중 하나에 정의
    interface : 변수 타입만 체크
    classes : 변수 타입도 체크하고, 인스턴스 또한 생성 가능
*/

// export interface Board { // 변수의 타입만 지정하는 interface
//     id: string;
//     title: string;
//     description: string;
//     status: BoardStatus; // 게시글의 공개 여부
// }

// status 컬럼이 아래 2개의 값만 가질 수 있도록, 이 외 값이 들어가면 에러
export enum BoardStatus {
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE'
}