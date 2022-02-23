import { Body, Controller, Logger, Post, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {

    private logger = new Logger('AuthController'); // 'AuthController'는 로그 상단에 찍을 내용

    constructor( private authService: AuthService ){} // DI

    // 회원가입
    @Post('/signup')
    signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<void> {
        // ValidationPipe : 핸들러가 실행되기 이전에 dto에 설정한 validation check 수행
        this.logger.debug(`회원가입`);
        return this.authService.signUp(authCredentialsDto);
    }

    // 로그인
    @Post('/signin')
    signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
        return this.authService.signIn(authCredentialsDto);
    }

    

    // 인증
    // @Post('/test')
    // @UseGuards(AuthGuard())
    // // AuthGuard() 는 @nestjs/passport 에서 가져온 것으로 2가지 기능이 있다.
    // // 1. 토큰이 변조되면 401 error return 
    // // 2. req 안에 user 정보를 넣을 수 있다.(jwt.stategy.ts에서 return user 했기 때문)
    // test(@Req req) {
    //     console.log('req', req);
    // } 

    // @Post('/test')
    // @UseGuards(AuthGuard())
    // test(@GetUser() user: User) { // 커스텀 데코레이터 => get-user.decorator.ts 사용
    //     console.log('user', user);
    // } 

    // @UseGuards(AuthGuard()) => 토큰이 변조되면 401 error return 

}
