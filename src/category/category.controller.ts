import { Controller, Get, Post } from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/userType.enum';
import { CategoryService } from './category.service';
import { ReturnCategory } from './dtos/returnCategory.dto';

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
}
