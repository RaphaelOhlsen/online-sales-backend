import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryService } from '../category/category.service';
import { CreateProductDto } from './dtos/createProduct.dto';
import { UpdateproductDto } from './dtos/updateProduct.dto';
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

  async checkProductExists(id: number): Promise<ProductEntity> {
    const exist = await this.productRepository.findOne({ where: { id } });

    if (!exist) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    return exist;
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

  async updateProduct(
    updateProductDto: UpdateproductDto,
    productId: number,
  ): Promise<ProductEntity> {
    const { categoryId } = updateProductDto;
    await this.checkProductExists(productId);
    await this.categoryService.checkCategoryById(categoryId).catch(() => {
      throw new ConflictException('Category not found');
    });
    await this.productRepository
      .update(productId, {
        ...updateProductDto,
      })
      .catch(() => {
        throw new InternalServerErrorException();
      });

    return this.checkProductExists(productId);
  }

  async deleteProduct(id: number): Promise<boolean> {
    await this.checkProductExists(id);
    await this.productRepository.delete(id);
    return true;
  }
}
