import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialsDto } from "./dto/auth-credential.dto";
import { User } from "./user.entity";
import * as bcrypt from "bcrypt";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto;
    
        // 비밀번호 암호화
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt); // salt는 유저마다 다름

        const user = this.create({ username, password: hashedPassword }); // 유저 INSERT
        
        // username이 중복될 때 response해줄 err msg
        try {
            await this.save(user);
        } catch (error) {
            if(error.code === '23505') { // entity의 @Unique(['username']) 코드에 의한 에러코드가 23505
                throw new ConflictException('Existing username');
            } else {
                throw new InternalServerErrorException();
            }
        }

    }
}

