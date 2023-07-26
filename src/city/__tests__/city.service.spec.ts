import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CacheService } from '../../cache/cache.service';
import { CityService } from '../city.service';
import { CityEntity } from '../entities/city.entity';
import { cityMock } from '../__mocks__/city.mock';

describe('CityService', () => {
  let service: CityService;
  let cityRepository: Repository<CityEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CityService,
        {
          provide: CacheService,
          useValue: {
            getCache: jest.fn().mockResolvedValue([cityMock]),
          },
        },
        {
          provide: getRepositoryToken(CityEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue({ cityMock }),
          },
        },
      ],
    }).compile();

    service = module.get<CityService>(CityService);
    cityRepository = module.get<Repository<CityEntity>>(
      getRepositoryToken(CityEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(cityRepository).toBeDefined();
  });

  it('should be able to get city by id', async () => {
    const city = await service.getCityById(cityMock.id);
    expect(city).toEqual({ cityMock });
  });

  it('should able to return error in get city by id', async () => {
    jest.spyOn(cityRepository, 'findOne').mockResolvedValueOnce(undefined);
    expect(service.getCityById(cityMock.id)).rejects.toThrow(Error);
  });

  it('should be able to get all cities', async () => {
    const cities = await service.getAllCitiesByStateId(cityMock.id);
    expect(cities).toEqual([cityMock]);
  });
});
