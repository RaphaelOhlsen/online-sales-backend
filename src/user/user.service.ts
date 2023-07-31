import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserType } from './enum/userType.enum';
import { UpdatePasswordDto } from './dtos/updatePassword.dto';
import { createHashedPassword, comparePasswords } from '../utils/password';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  private async checkUserExists(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { email, password } = createUserDto;
    const verifyEmailExist = await this.getUserByEmail(email).catch(
      () => undefined,
    );

    if (verifyEmailExist) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await createHashedPassword(password);

    const user = this.userRepository.create({
      ...createUserDto,
      typeUser: UserType.User,
      password: hashedPassword,
    });

    await this.userRepository.save(user);
    return user;
  }

  async getUserByIdUsingRelations(userId: number): Promise<UserEntity> {
    await this.checkUserExists(userId);
    return this.userRepository.findOne({
      where: { id: userId },
      relations: {
        addresses: {
          city: {
            state: true,
          },
        },
      },
    });
  }

  getAllUsers(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async getUserById(userId: number): Promise<UserEntity> {
    await this.checkUserExists(userId);
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async updatePasswordUser(
    UpdatePasswordDto: UpdatePasswordDto,
    userId: number,
  ): Promise<UserEntity> {
    const { newPassword, lastPassword } = UpdatePasswordDto;

    const user = await this.checkUserExists(userId);

    const isMatch = await comparePasswords(lastPassword, user.password || '');

    if (!isMatch) {
      throw new BadRequestException('Invalid password');
    }

    const hashedPassword = await createHashedPassword(newPassword);

    const updatedUser = this.userRepository.save({
      ...user,
      password: hashedPassword,
    });

    if (!updatedUser) {
      throw new BadRequestException('Error updating password');
    }

    return updatedUser;
  }

  async deleteUser(userId: number): Promise<void> {
    await this.userRepository.delete(userId);
  }
}
