import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CityService } from '../city/city.service';
import { UserService } from '../user/user.service';
import { CreateAddressDto } from './dtos/createAddress.dto';
import { AddressEntity } from './entities/address.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private addressRepository: Repository<AddressEntity>,
    private userService: UserService,
    private cityService: CityService,
  ) {}

  async createAddress(
    createAddressDto: CreateAddressDto,
    userId: number,
  ): Promise<AddressEntity> {
    await this.userService.getUserById(userId);
    await this.cityService.getCityById(createAddressDto.cityId);
    const address = {
      ...createAddressDto,
      userId,
    };

    return this.addressRepository.save(address);
  }
}
