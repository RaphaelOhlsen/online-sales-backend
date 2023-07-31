import { Body, Controller, Post } from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/userType.enum';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { ReturnLogin } from './dtos/returnLogin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Roles(UserType.Admin, UserType.User)
  @Post()
  async login(@Body() loginDto: LoginDto): Promise<ReturnLogin> {
    return this.authService.login(loginDto);
  }
}
