import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  private readonly validTypes = ['Perecedero', 'No perecedero'];

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({ relations: ['tiendas'] });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['tiendas'],
    });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return product;
  }

  async create(productData: Partial<Product>): Promise<Product> {
    if (!this.validTypes.includes(productData.tipo)) {
      throw new BadRequestException(
        'Tipo de producto inválido. Debe ser "Perecedero" o "No perecedero".',
      );
    }
    const product = this.productRepository.create(productData);
    return this.productRepository.save(product);
  }

  async update(id: number, productData: Partial<Product>): Promise<Product> {
    if (productData.tipo && !this.validTypes.includes(productData.tipo)) {
      throw new BadRequestException(
        'Tipo de producto inválido. Debe ser "Perecedero" o "No perecedero".',
      );
    }
    const product = await this.findOne(id);

    for (const key in productData) {
      if (productData.hasOwnProperty(key)) {
        product[key] = productData[key];
      }
    }
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return this.productRepository.save(product);
  }

  async delete(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
}
