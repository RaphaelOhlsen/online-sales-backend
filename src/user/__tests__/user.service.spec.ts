import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserService } from '../user.service';
import { userEntityMock } from '../__mocks__/user.mock';
import { createUserMock } from '../__mocks__/createUser.mock';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(userEntityMock),
            save: jest.fn().mockResolvedValue(userEntityMock),
            create: jest.fn().mockReturnValue(userEntityMock),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  it('should be able to get a user by email', async () => {
    const user = await service.getUserByEmail(userEntityMock.email);
    expect(user).toEqual(userEntityMock);
  });

  it('should able to return error in get a user by email sending undefined request', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(undefined);
    expect(service.getUserByEmail(userEntityMock.email)).rejects.toThrowError();
  });

  it('should able to return error in get a user by email (error DB)', async () => {
    jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());
    expect(service.getUserByEmail(userEntityMock.email)).rejects.toThrow(Error);
  });

  it('should be able to get a user by id', async () => {
    const user = await service.getUserById(userEntityMock.id);
    expect(user).toEqual(userEntityMock);
  });

  it('should able to return error in get a user by id', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(undefined);
    expect(service.getUserById(userEntityMock.id)).rejects.toThrow(Error);
  });

  it('should able to return error in get a user by id (error DB)', async () => {
    jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());
    expect(service.getUserById(userEntityMock.id)).rejects.toThrow(Error);
  });

  it('should be able to get a user by id whith relations', async () => {
    const user = await service.getUserByIdUsingRelations(userEntityMock.id);
    expect(user).toEqual(userEntityMock);
  });

  it('should return error if user exist', async () => {
    expect(service.createUser(createUserMock)).rejects.toThrowError();
  });

  it('should be able to return user if user not exist', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(undefined);
    const user = await service.createUser(createUserMock);
    expect(user).toEqual(userEntityMock);
  });
});
