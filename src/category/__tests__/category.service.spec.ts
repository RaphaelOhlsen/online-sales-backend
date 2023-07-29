import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryService } from '../category.service';
import { CategoryEntity } from '../entities/category.entity';
import { categoryMock } from '../__mocks__/category.mock';
import { createCategoryMock } from '../__mocks__/createCategory.mock';

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
            findOne: jest.fn().mockResolvedValue(true),
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

  describe('Test getAllCategories', () => {
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
      jest.spyOn(categoryRepository, 'find').mockRejectedValueOnce(new Error());
      const categories = service.getAllCategories();
      expect(categories).rejects.toThrowError();
    });
  });

  describe('Test createCategory', () => {
    it('should create a category', async () => {
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValueOnce(null);
      const category = await service.createCategory(createCategoryMock);

      expect(category).toBe(categoryMock);
    });

    it('should return error if exist category after save', async () => {
      const category = service.createCategory(createCategoryMock);
      expect(category).rejects.toThrowError(ConflictException);
    });

    it('should return error with exception when create a category', async () => {
      jest.spyOn(categoryRepository, 'save').mockRejectedValueOnce(new Error());
      const category = service.createCategory(createCategoryMock);
      expect(category).rejects.toThrowError();
    });
  });
});
