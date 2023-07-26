import { cityMock } from '../../city/__mocks__/city.mock';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { AddressEntity } from '../entities/address.entity';

export const addressMock: AddressEntity = {
  id: 1,
  cep: '12345678',
  cityId: cityMock.id,
  complement: 'complement',
  userId: userEntityMock.id,
  numberAddress: 123,
  createdAt: new Date(),
  updatedAt: new Date(),
};
