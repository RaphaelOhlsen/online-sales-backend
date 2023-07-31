import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { UserId } from '../decorators/userId.decorator';
import { CreateUserDto } from './dtos/createUser.dto';
import { ReturnUserDto } from './dtos/returnUser.dto';
import { UpdatePasswordDto } from './dtos/updatePassword.dto';
import { UserEntity } from './entities/user.entity';
import { UserType } from './enum/userType.enum';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.userService.createUser(createUserDto);
  }

  // @Roles(UserType.Admin)
  @Get()
  async getAllUsers(): Promise<ReturnUserDto[]> {
    const users = await this.userService.getAllUsers();
    return users.map((user) => new ReturnUserDto(user));
  }

  // @Roles(UserType.Admin)
  @Get('/:id')
  async getUserById(@Param('id') id: number): Promise<ReturnUserDto> {
    const user = await this.userService.getUserByIdUsingRelations(id);
    return new ReturnUserDto(user);
  }

  // @Roles(UserType.Admin)
  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    await this.userService.deleteUser(id);
  }

  // @Roles(UserType.Admin, UserType.User)
  @Patch()
  async updatePasswordUser(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @UserId() userId: number,
  ): Promise<ReturnUserDto> {
    const user = await this.userService.updatePasswordUser(
      updatePasswordDto,
      userId,
    );
    return new ReturnUserDto(user);
  }
}
