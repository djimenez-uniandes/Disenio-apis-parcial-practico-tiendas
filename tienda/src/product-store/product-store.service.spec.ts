import { Test, TestingModule } from '@nestjs/testing';

import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ProductService } from 'src/product/product.service';
import { Product } from 'src/product/entities/product.entity';

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debe crear un producto válido', async () => {
      const productData = Product.createProduct(
        undefined,
        'Leche',
        2.5,
        'Perecedero',
      );
      const savedProduct = Product.createProduct(1, 'Leche', 2.5, 'Perecedero');

      jest.spyOn(repository, 'create').mockReturnValue(savedProduct);
      jest.spyOn(repository, 'save').mockResolvedValue(savedProduct);

      expect(await service.create(productData)).toEqual(savedProduct);
    });

    it('debe lanzar una excepción para tipo inválido', async () => {
      const productData = Product.createProduct(
        undefined,
        'Leche',
        2.5,
        'Perecedero',
      );

      await expect(service.create(productData)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('debe retornar un array de productos', async () => {
      const products: Product[] = [
        Product.createProduct(1, 'Leche', 2.5, 'Perecedero'),
        Product.createProduct(2, 'Pan', 1.0, 'No perecedero'),
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(products);

      expect(await service.findAll()).toEqual(products);
    });
  });

  describe('findOne', () => {
    it('debe retornar un producto por ID', async () => {
      const product = new Product();
      product.id = 1;
      product.nombre = 'Leche';
      product.precio = 2.5;
      product.tipo = 'Perecedero';

      jest.spyOn(repository, 'findOne').mockResolvedValue(product);

      expect(await service.findOne(1)).toEqual(product);
    });

    it('debe lanzar una excepción si el producto no existe', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debe actualizar un producto existente', async () => {
      // const product = Product.createProduct(1, 'Leche', 2.5, 'Perecedero');
      const updateData = Product.createProduct(1, 'Leche', 3.0, 'Perecedero');

      jest.spyOn(repository, 'preload').mockResolvedValue(updateData);
      jest.spyOn(repository, 'save').mockResolvedValue(updateData);

      expect(await service.update(1, updateData)).toEqual(updateData);
    });

    it('debe lanzar una excepción si el producto no existe', async () => {
      jest.spyOn(repository, 'preload').mockResolvedValue(null);

      await expect(service.update(999, { precio: 3.0 })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('debe lanzar una excepción para tipo inválido', async () => {
      // const product = Product.createProduct(1, 'Leche', 2.5, 'Perecedero');
      const productUpdate = Product.createProduct(
        1,
        'Leche',
        2.5,
        'Electrónico',
      );
      const updateData = { tipo: 'Electrónico' };

      jest
        .spyOn(repository, 'preload')
        .mockResolvedValue(productUpdate as Product);

      await expect(service.update(1, updateData)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('delete', () => {
    it('debe eliminar un producto existente', async () => {
      const product = Product.createProduct(1, 'Leche', 2.5, 'Perecedero');

      jest.spyOn(service, 'findOne').mockResolvedValue(product);
      jest.spyOn(repository, 'remove').mockResolvedValue(null);

      expect(await service.delete(1)).toBeUndefined();
    });

    it('debe lanzar una excepción si el producto no existe', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(service.delete(999)).rejects.toThrow(NotFoundException);
    });
  });
});
