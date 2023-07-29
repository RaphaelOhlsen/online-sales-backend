import { CreateProductDto } from '../dtos/createProduct.dto';
import { productMock } from './product.mock';

export const createProductMock: CreateProductDto = {
  name: productMock.name,
  categoryId: productMock.categoryId,
  price: productMock.price,
  image: productMock.image,
};
