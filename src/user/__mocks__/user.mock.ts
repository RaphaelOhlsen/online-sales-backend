import { UserEntity } from '../entities/user.entity';
import { UserType } from '../enum/userType.enum';

export const userEntityMock: UserEntity = {
  id: 1,
  name: 'Teste',
  email: 'teste@teste.com',
  password: '123456',
  cpf: '12312312312',
  phone: '12312312312',
  typeUser: UserType.User,
  updated_at: new Date(),
};
