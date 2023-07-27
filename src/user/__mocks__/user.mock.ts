import { UserEntity } from '../entities/user.entity';
import { UserType } from '../enum/userType.enum';

export const userEntityMock: UserEntity = {
  id: 1,
  name: 'Teste',
  email: 'teste@teste.com',
  password: '$2b$10$2TmZRPAvIyR6dqX6Rzid4.r6WmZSFwv87kNLy1/4DH02GJJOqLxLu',
  cpf: '12312312312',
  phone: '12312312312',
  typeUser: UserType.User,
  updated_at: new Date(),
};
