import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CityService } from '../../city/city.service';
import { cityMock } from '../../city/__mocks__/city.mock';
import { UserService } from '../../user/user.service';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { AddressService } from '../address.service';
import { AddressEntity } from '../entities/address.entity';
import { addressMock } from '../__mocks__/address.mock';
import { createAddressMock } from '../__mocks__/createAddress.mock';

describe('AddressService', () => {
  let service: AddressService;
  let addressRepository: Repository<AddressEntity>;
  let userService: UserService;
  let cityService: CityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        {
          provide: CityService,
          useValue: {
            getCityById: jest.fn().mockResolvedValue(cityMock),
          },
        },
        {
          provide: UserService,
          useValue: {
            getUserById: jest.fn().mockResolvedValue(userEntityMock),
          },
        },
        {
          provide: getRepositoryToken(AddressEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(addressMock),
            find: jest.fn().mockResolvedValue([addressMock]),
          },
        },
      ],
    }).compile();

    service = module.get<AddressService>(AddressService);
    userService = module.get<UserService>(UserService);
    cityService = module.get<CityService>(CityService);
    addressRepository = module.get<Repository<AddressEntity>>(
      getRepositoryToken(AddressEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(addressRepository).toBeDefined();
    expect(userService).toBeDefined();
    expect(cityService).toBeDefined();
  });

  it('should be able to create a address', async () => {
    const address = await service.createAddress(
      createAddressMock,
      userEntityMock.id,
    );
    expect(address).toBe(addressMock);
  });

  it('should return error if exception in userService', async () => {
    jest.spyOn(userService, 'getUserById').mockRejectedValueOnce(new Error());

    expect(
      service.createAddress(createAddressMock, userEntityMock.id),
    ).rejects.toThrowError();
  });

  it('should return error if exception in cityService', async () => {
    jest.spyOn(cityService, 'getCityById').mockRejectedValueOnce(new Error());

    expect(
      service.createAddress(createAddressMock, userEntityMock.id),
    ).rejects.toThrowError();
  });

  it('should return all addresses of a user', async () => {
    const addresses = await service.getAddressesByUserId(userEntityMock.id);

    expect(addresses).toEqual([addressMock]);
  });

  it('should return error when user doesnt have address', async () => {
    jest.spyOn(addressRepository, 'find').mockResolvedValueOnce(undefined);

    const addresses = service.getAddressesByUserId(userEntityMock.id);
    //Retrornar o errro 'user does not have addresses'
    expect(addresses).rejects.toThrowError();
  });
});
