import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductService } from '../product.service';
import { ProductEntity } from '../entities/product.entity';
import { productMock } from '../__mocks__/product.mock';
import { createProductMock } from '../__mocks__/createProduct.mock';
import { returnProductMock } from '../__mocks__/returnProduct.mock';
import { updateProductMock } from '../__mocks__/updateProduct.mock';
import { CategoryService } from '../../category/category.service';

describe('ProductService', () => {
  let service: ProductService;
  let categoryService: CategoryService;
  let productRepository: Repository<ProductEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: CategoryService,
          useValue: {
            checkCategoryById: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(returnProductMock),
            find: jest.fn().mockResolvedValue([productMock]),
            findOne: jest.fn().mockResolvedValue(productMock),
            delete: jest.fn().mockResolvedValue(true),
            update: jest.fn().mockResolvedValue(productMock),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    categoryService = module.get<CategoryService>(CategoryService);
    productRepository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(categoryService).toBeDefined();
    expect(productRepository).toBeDefined();
  });

  describe('Test getAllProducts', () => {
    it('should return all products', async () => {
      const products = await service.getAllProducts();
      expect(products).toEqual([productMock]);
    });

    it('should return error in product empity list', async () => {
      jest.spyOn(productRepository, 'find').mockResolvedValue([]);
      const products = service.getAllProducts();
      await expect(products).rejects.toThrowError();
    });

    it('shoul return error in product exception list', async () => {
      jest.spyOn(productRepository, 'find').mockRejectedValueOnce(new Error());
      const products = service.getAllProducts();
      expect(products).rejects.toThrowError();
    });
  });

  describe('Test getProductById', () => {
    it('should return a product', async () => {
      const product = await service.checkProductExists(productMock.id);
      expect(product).toEqual(productMock);
    });

    it('should return error if product not found', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce(null);
      const product = service.checkProductExists(1);
      expect(product).rejects.toThrowError('Product #1 not found');
    });
  });

  describe('Test createProduct', () => {
    it('should create a product', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce(null);
      const product = await service.createProduct(createProductMock);

      expect(product).toEqual(returnProductMock);
    });

    it('should return error if exist product after save', async () => {
      const product = service.createProduct(createProductMock);
      expect(product).rejects.toThrowError('Product already exists');
    });

    it('should return error if category not found', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce(undefined);
      jest
        .spyOn(categoryService, 'checkCategoryById')
        .mockRejectedValueOnce(new Error());
      const product = service.createProduct(createProductMock);
      expect(product).rejects.toThrowError('Category not found');
    });

    it('should return error with exception when create a product', async () => {
      jest.spyOn(productRepository, 'save').mockRejectedValueOnce(new Error());
      const product = service.createProduct(createProductMock);
      expect(product).rejects.toThrowError();
    });
  });

  describe('Test updateProduct', () => {
    it('should update a product', async () => {
      const product = await service.updateProduct(
        updateProductMock,
        productMock.id,
      );
      expect(product).toEqual(productMock);
    });

    it('should return error if product not found', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce(null);
      const product = service.updateProduct(createProductMock, 1);
      expect(product).rejects.toThrowError('Product #1 not found');
    });

    it('should return error if category not found', async () => {
      jest
        .spyOn(categoryService, 'checkCategoryById')
        .mockRejectedValueOnce(new Error());
      const product = service.updateProduct(createProductMock, 1);
      expect(product).rejects.toThrowError('Category not found');
    });

    it('should return error with exception when update a product', async () => {
      jest
        .spyOn(productRepository, 'update')
        .mockRejectedValueOnce(new Error());
      const product = service.updateProduct(createProductMock, 1);
      expect(product).rejects.toThrowError('Internal Server Error');
    });
  });

  describe('Test deleteProduct', () => {
    it('should delete a product', async () => {
      const deleted = await service.deleteProduct(productMock.id);
      expect(deleted).toEqual(true);
    });

    it('should return error if product not found', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce(undefined);
      const deleted = service.deleteProduct(1);
      expect(deleted).rejects.toThrowError('Product #1 not found');
    });

    it('should return error with exception when delete a product', async () => {
      jest
        .spyOn(productRepository, 'delete')
        .mockRejectedValueOnce(new Error());
      const deleted = service.deleteProduct(1);
      expect(deleted).rejects.toThrowError();
    });
  });
});
