import { Body, Controller, Get, Post } from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/userType.enum';
import { CreateProductDto } from './dtos/createProduct.dto';
import { ReturnProduct } from './dtos/returnProduct.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // @Roles(UserType.Admin, UserType.User)
  @Get()
  async getAllProducts(): Promise<ReturnProduct[]> {
    const products = await this.productService.getAllProducts();
    const returnProducts = products.map(
      (product) => new ReturnProduct(product),
    );
    return returnProducts;
  }

  // @Roles(UserType.Admin, UserType.User)
  @Post()
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    const product = this.productService.createProduct(createProductDto);
    return product;
  }
}