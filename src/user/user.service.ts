import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserType } from './enum/userType.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  private async checkUserExists(id: number) {
    const exist = await this.userRepository.findOne({ where: { id } });

    if (!exist) {
      throw new NotFoundException(`User #${id} not found`);
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const verifyEmailExist = await this.getUserByEmail(
      createUserDto.email,
    ).catch(() => undefined);

    if (verifyEmailExist) {
      throw new BadRequestException('Email already exists');
    }

    const { password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

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

  async deleteUser(userId: number): Promise<void> {
    await this.userRepository.delete(userId);
  }
}
