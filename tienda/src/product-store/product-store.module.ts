import { Module } from '@nestjs/common';
import { ProductStoreService } from './product-store.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from 'src/store/entities/store.entity';
import { Product } from 'src/product/entities/product.entity';
import { ProductStoreController } from './product-store.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Store])],
  providers: [ProductStoreService],
  exports: [ProductStoreService],
  controllers: [ProductStoreController],
})
export class ProductStoreModule {}
