import { Body, Controller, Post } from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { UserId } from '../decorators/userId.decorator';
import { UserType } from '../user/enum/userType.enum';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dtos/createAddress.dto';
import { AddressEntity } from './entities/address.entity';
@Roles(UserType.User)
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
}
