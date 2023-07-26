import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @IsOptional()
  complement: string;

  @IsInt()
  @IsNotEmpty()
  numberAddress: number;

  @IsString()
  @IsNotEmpty()
  cep: string;

  @IsNotEmpty()
  @IsInt()
  cityId: number;
}
