import { Body, Controller, Get, Post } from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { UserId } from '../decorators/userId.decorator';
import { UserType } from '../user/enum/userType.enum';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dtos/createAddress.dto';
import { AddressEntity } from './entities/address.entity';
import { ReturnAddressDto } from './dtos/returnAddress.dto';
@Roles(UserType.User, UserType.Admin)
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  createAddress(
    @Body() createAddressDto: CreateAddressDto,
    @UserId() userId: number,
  ): Promise<AddressEntity> {
    return this.addressService.createAddress(createAddressDto, userId);
  }

  @Get()
  async getAddressesByUserId(
    @UserId() userId: number,
  ): Promise<ReturnAddressDto[]> {
    const addresses = await this.addressService.getAddressesByUserId(userId);
    const returnAddresses = addresses.map(
      (address) => new ReturnAddressDto(address),
    );
    return returnAddresses;
  }
}
