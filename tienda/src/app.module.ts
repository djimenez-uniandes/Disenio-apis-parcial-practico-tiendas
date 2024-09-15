import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { StoreModule } from './store/store.module';
import { Product } from './product/entities/product.entity';
import { Store } from './store/entities/store.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductStoreModule } from './product-store/product-store.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'tienda',
      entities: [Product, Store],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    ProductModule,
    StoreModule,
    ProductStoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
