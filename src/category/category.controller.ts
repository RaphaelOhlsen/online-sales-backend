import { Body, Controller, Get, Post } from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/userType.enum';
import { CategoryService } from './category.service';
import { CreateCategory } from './dtos/createCategory.dto';
import { ReturnCategory } from './dtos/returnCategory.dto';
import { CategoryEntity } from './entities/category.entity';

@Roles(UserType.Admin, UserType.User)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAllCategories(): Promise<ReturnCategory[]> {
    const categories = await this.categoryService.getAllCategories();
    const returnCategories = categories.map(
      (category) => new ReturnCategory(category),
    );
    return returnCategories;
  }

  @Roles(UserType.Admin)
  @Post()
  createCategory(
    @Body() createCategory: CreateCategory,
  ): Promise<CategoryEntity> {
    const categories = this.categoryService.createCategory(createCategory);
    return categories;
  }
}
