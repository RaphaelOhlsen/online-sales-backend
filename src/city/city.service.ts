import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CityEntity } from './entities/city.entity';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(CityEntity)
    private cityRepository: Repository<CityEntity>,
    private readonly cacheService: CacheService,
  ) {}

  private async checkCityExists(id: number) {
    const exist = await this.cityRepository.findOne({ where: { id } });

    if (!exist) {
      throw new NotFoundException(`City #${id} not found`);
    }
  }

  async getAllCitiesByStateId(stateId: number): Promise<CityEntity[]> {
    const key = `state_${stateId}`;
    const findCities = async () =>
      this.cityRepository.find({ where: { stateId } });

    return this.cacheService.getCache<CityEntity[]>(key, findCities);
  }

  async getCityById(cityId: number): Promise<CityEntity> {
    await this.checkCityExists(cityId);
    return this.cityRepository.findOne({ where: { id: cityId } });
  }
}
