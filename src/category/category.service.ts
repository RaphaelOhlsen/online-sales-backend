import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategory } from './dtos/createCategory.dto';
import { ReturnCategory } from './dtos/returnCategory.dto';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  private async checkCategoryByName(name: string): Promise<void> {
    const exist = await this.categoryRepository.findOne({ where: { name } });
    if (exist) {
      throw new ConflictException('Category already exists');
    }
  }

  async getAllCategories(): Promise<CategoryEntity[]> {
    const categories = await this.categoryRepository.find();

    if (!categories || categories.length === 0) {
      throw new NotFoundException('Categories are empty');
    }

    return categories;
  }

  async createCategory(
    createCategory: CreateCategory,
  ): Promise<ReturnCategory> {
    createCategory = {
      ...createCategory,
      name: createCategory.name.toLowerCase(),
    };
    await this.checkCategoryByName(createCategory.name);
    const category = await this.categoryRepository.save(createCategory);
    return category;
  }
}
