import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "./user.entity";
import { UserRepository } from "./user.repository";
import * as config from 'config';

@Injectable() // 다른 파일에서 주입해서 쓸수 있게 설정
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository // jwt payload 내 username으로 DB 조회해야하기 때문에 repository DI
    ) {
        super({ // 부모 클래스의 생성자 호출
            secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'), // 토큰이 유효한지 체크할 때 사용
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() // 토큰을 Authorization 헤더의 Bearer type의 Token에서 가져오겠다는 의미
        })
    }

    async validate(payload) {
        const { username } = payload; // jwt 내 payload에서 username 가져오기
        const user: User = await this.userRepository.findOne({ username }); // 가져온 username으로 DB SELECT

        if(!user) {
            throw new UnauthorizedException();
        }

        return user; // 이 user data를 req에 넣으려면 controller에서 @UseGuards(AuthGuard()) 데코레이터 사용
    }
}