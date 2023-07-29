import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryService } from '../category/category.service';
import { CreateProductDto } from './dtos/createProduct.dto';
import { ReturnProduct } from './dtos/returnProduct.dto';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly categoryService: CategoryService,
  ) {}

  private async checkProductByName(name: string): Promise<void> {
    const exist = await this.productRepository.findOne({ where: { name } });
    if (exist) {
      throw new Error();
    }
  }

  async getAllProducts(): Promise<ProductEntity[]> {
    const products = await this.productRepository.find();

    if (!products || products.length === 0) {
      throw new NotFoundException('Products are empty');
    }

    return products;
  }

  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    const { name, categoryId } = createProductDto;
    createProductDto = {
      ...createProductDto,
      name: createProductDto.name.toLowerCase(),
    };

    await this.checkProductByName(name).catch(() => {
      throw new ConflictException('Product already exists');
    });

    await this.categoryService.checkCategoryById(categoryId).catch(() => {
      throw new ConflictException('Category not found');
    });

    const product = await this.productRepository.save(createProductDto);
    return product;
  }
}
