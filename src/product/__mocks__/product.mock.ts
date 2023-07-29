import { categoryMock } from '../../category/__mocks__/category.mock';
import { ProductEntity } from '../entities/product.entity';

export const productMock: ProductEntity = {
  id: 1,
  name: 'product',
  price: 10,
  categoryId: categoryMock.id,
  createdAt: new Date(),
  updatedAt: new Date(),
  image: 'image',
};
