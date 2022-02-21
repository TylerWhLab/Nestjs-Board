import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        // DI
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ){}

    // 회원가입
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.userRepository.createUser(authCredentialsDto);
    }

    // 로그인
    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
        const { username, password } = authCredentialsDto;
        const user = await this.userRepository.findOne({ username });

        if(user && (await bcrypt.compare(password, user.password))) {

            // accessToken 생성(secret + payload)
            const payload = { username: username } // base64로 인코딩하기 때문에 중요정보는 넣으면 안됨
            const accessToken = await this.jwtService.sign(payload); // jwt 3번째에 들어가는 verify signature ?

            return { accessToken: accessToken }
        } else {
            throw new UnauthorizedException('login failed');
        }
    }

}
