import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as config from 'config';

const dbConfig = config.get('db');

export const typeORMConfig: TypeOrmModuleOptions = {
    type: dbConfig.type,
    host: process.env.RDS_HOSTNAME || dbConfig.host, // 운영에서는 환경변수 적용 || 환경변수가 없으면 config 설정값 사용
    port: process.env.RDS_PORT || dbConfig.port,
    username: process.env.RDS_USERNAME || dbConfig.username,
    password: process.env.RDS_PASSWORD || dbConfig.password,
    database: process.env.RDS_DB_NAME || dbConfig.database,
    entities: [__dirname + '/../**/*.entity.{js,ts}'], // 엔티티(컬럼을 지정한 class)를 이용해서 Table 생성 => 따라서 엔티티 파일 위치 설정
    synchronize: dbConfig.synchronize // true: app 재실행 => 엔티티 안에서 컬럼의 속성이 수정될 경우 해당 테이블을 Drop 후 재생성
}