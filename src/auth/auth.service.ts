import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ReturnUserDto } from '../user/dtos/returnUser.dto';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { comparePasswords } from '../utils/password';
import { LoginDto } from './dtos/login.dto';
import { LoginPayload } from './dtos/loginPayload.dto';
import { ReturnLogin } from './dtos/returnLogin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<ReturnLogin> {
    const { email, password } = loginDto;
    const user: UserEntity | undefined = await this.userService
      .getUserByEmail(email)
      .catch(() => undefined);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await comparePasswords(password, user?.password || '');

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      accessToken: this.jwtService.sign({ ...new LoginPayload(user) }),
      user: new ReturnUserDto(user),
    };
  }
}
