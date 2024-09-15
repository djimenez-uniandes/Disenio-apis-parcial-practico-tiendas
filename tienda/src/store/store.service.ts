import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async findAll(): Promise<Store[]> {
    return this.storeRepository.find({ relations: ['productos'] });
  }

  async findOne(id: number): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: { id },
      relations: ['productos'],
    });
    if (!store) {
      throw new NotFoundException(`Tienda con ID ${id} no encontrada`);
    }
    return store;
  }

  async create(storeData: Partial<Store>): Promise<Store> {
    if (!/^[A-Z]{3}$/.test(storeData.ciudad)) {
      throw new BadRequestException(
        'La ciudad debe ser un código de tres caracteres en mayúsculas (e.g., BOG, MED).',
      );
    }
    const store = this.storeRepository.create(storeData);
    return this.storeRepository.save(store);
  }

  async update(id: number, storeData: Partial<Store>): Promise<Store> {
    if (storeData.ciudad && !/^[A-Z]{3}$/.test(storeData.ciudad)) {
      throw new BadRequestException(
        'La ciudad debe ser un código de tres caracteres en mayúsculas (e.g., BOG, MED).',
      );
    }
    const store = await this.findOne(id);
    if (!store) {
      throw new NotFoundException(`Tienda con ID ${id} no encontrada`);
    }

    for (const key in storeData) {
      if (storeData.hasOwnProperty(key)) {
        store[key] = storeData[key];
      }
    }

    return this.storeRepository.save(store);
  }

  async delete(id: number): Promise<void> {
    const store = await this.findOne(id);
    await this.storeRepository.remove(store);
  }
}
