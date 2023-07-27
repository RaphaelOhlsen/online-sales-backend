import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryService } from '../category.service';
import { CategoryEntity } from '../entities/category.entity';
import { categoryMock } from '../__mocks__/categoryMock';

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepository: Repository<CategoryEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(CategoryEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(categoryMock),
            find: jest.fn().mockResolvedValue([categoryMock]),
          },
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get<Repository<CategoryEntity>>(
      getRepositoryToken(CategoryEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(categoryRepository).toBeDefined();
  });

  it('should return all categories', async () => {
    const categories = await service.getAllCategories();
    expect(categories).toEqual([categoryMock]);
  });

  it('shoul return error in category empity list', async () => {
    jest.spyOn(categoryRepository, 'find').mockResolvedValue([]);
    const categories = service.getAllCategories();
    await expect(categories).rejects.toThrowError();
  });

  it('shoul return error in category exception list', async () => {
    jest.spyOn(categoryRepository, 'find').mockRejectedValue(new Error());
    const categories = service.getAllCategories();
    expect(categories).rejects.toThrowError();
  });
  // it('should create a category', async () => {
  //   jest.spyOn(categoryRepository, 'create').mockResolvedValue(categoryMock);

  //   const category = await service.createCategory(categoryMock);

  //   expect(category).toBe(categoryMock);
  // });
});
