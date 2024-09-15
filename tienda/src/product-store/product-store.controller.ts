import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ProductStoreService } from './product-store.service';
import { Store } from '../store/entities/store.entity';

@Controller('products/:productId/stores')
export class ProductStoreController {
  constructor(private readonly productStoreService: ProductStoreService) {}

  @Post(':storeId')
  async addStoreToProduct(
    @Param('productId') productId: number,
    @Param('storeId') storeId: number,
  ) {
    await this.productStoreService.addStoreToProduct(productId, storeId);
  }

  @Get()
  async findStoresFromProduct(
    @Param('productId') productId: number,
  ): Promise<Store[]> {
    return this.productStoreService.findStoresFromProduct(productId);
  }

  @Get(':storeId')
  async findStoreFromProduct(
    @Param('productId') productId: number,
    @Param('storeId') storeId: number,
  ): Promise<Store> {
    return this.productStoreService.findStoreFromProduct(productId, storeId);
  }

  @Put()
  async updateStoresFromProduct(
    @Param('productId') productId: number,
    @Body() storeIds: number[],
  ) {
    await this.productStoreService.updateStoresFromProduct(productId, storeIds);
  }

  @Delete(':storeId')
  async deleteStoreFromProduct(
    @Param('productId') productId: number,
    @Param('storeId') storeId: number,
  ) {
    await this.productStoreService.deleteStoreFromProduct(productId, storeId);
  }
}
