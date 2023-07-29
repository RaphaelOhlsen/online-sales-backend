import { UpdateproductDto } from '../dtos/updateProduct.dto';
import { productMock } from './product.mock';

export const updateProductMock: UpdateproductDto = {
  name: 'produto alterado',
  categoryId: productMock.categoryId,
  price: productMock.price,
  image: productMock.image,
};
