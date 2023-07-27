import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../user/user.service';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { AuthService } from '../auth.service';
import { jwtMock } from '../__mocks__/jwt.mock';
import { loginDtoMock } from '../__mocks__/loginDto.mock';
import { ReturnUserDto } from '../../user/dtos/returnUser.dto';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            getUserByEmail: jest.fn().mockResolvedValue(userEntityMock),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: () => jwtMock,
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
  });

  it('shoul return user if password and email is valid', async () => {
    const user = await service.login(loginDtoMock);

    expect(user).toEqual({
      accessToken: jwtMock,
      user: new ReturnUserDto(userEntityMock),
    });
  });

  it('should throw an error if user is not found', async () => {
    jest.spyOn(userService, 'getUserByEmail').mockResolvedValueOnce(undefined);

    await expect(service.login(loginDtoMock)).rejects.toThrow(
      'Invalid credentials',
    );
  });

  it('should throw an error if password is invalid', async () => {
    const user = service.login({
      ...loginDtoMock,
      password: 'invalidPassword',
    });
    expect(user).rejects.toThrow('Invalid credentials');
  });

  it('should return error in UserService', async () => {
    jest
      .spyOn(userService, 'getUserByEmail')
      .mockRejectedValueOnce(new Error());

    await expect(service.login(loginDtoMock)).rejects.toThrowError();
  });
});
