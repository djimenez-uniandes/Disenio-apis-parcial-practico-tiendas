import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';
import { Store } from 'src/store/entities/store.entity';

import { Repository } from 'typeorm';

@Injectable()
export class ProductStoreService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  // 1. Asociar una tienda a un producto
  async addStoreToProduct(productId: number, storeId: number): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['tiendas'],
    });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${productId} no encontrado`);
    }
    const store = await this.storeRepository.findOne({
      where: { id: storeId },
    });
    if (!store) {
      throw new NotFoundException(`Tienda con ID ${storeId} no encontrada`);
    }
    product.tiendas.push(store);
    await this.productRepository.save(product);
  }

  // 2. Obtener las tiendas que tienen un producto
  async findStoresFromProduct(productId: number): Promise<Store[]> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['tiendas'],
    });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${productId} no encontrado`);
    }
    return product.tiendas;
  }

  // 3. Obtener una tienda que tiene un producto
  async findStoreFromProduct(
    productId: number,
    storeId: number,
  ): Promise<Store> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['tiendas'],
    });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${productId} no encontrado`);
    }
    const store = product.tiendas.find((store) => store.id === storeId);
    if (!store) {
      throw new NotFoundException(
        `La tienda con ID ${storeId} no está asociada al producto`,
      );
    }
    return store;
  }

  // 4. Actualizar las tiendas que tienen un producto
  async updateStoresFromProduct(
    productId: number,
    storeIds: number[],
  ): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['tiendas'],
    });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${productId} no encontrado`);
    }
    const stores = await this.storeRepository.findByIds(storeIds);
    if (stores.length !== storeIds.length) {
      throw new NotFoundException('Una o más tiendas no fueron encontradas');
    }
    product.tiendas = stores;
    await this.productRepository.save(product);
  }

  // 5. Eliminar la tienda que tiene un producto
  async deleteStoreFromProduct(
    productId: number,
    storeId: number,
  ): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['tiendas'],
    });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${productId} no encontrado`);
    }
    const storeIndex = product.tiendas.findIndex(
      (store) => store.id === storeId,
    );
    if (storeIndex === -1) {
      throw new NotFoundException(
        `La tienda con ID ${storeId} no está asociada al producto`,
      );
    }
    product.tiendas.splice(storeIndex, 1);
    await this.productRepository.save(product);
  }
}
