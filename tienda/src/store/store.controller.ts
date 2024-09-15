import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { Store } from './entities/store.entity';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  async findAll(): Promise<Store[]> {
    return this.storeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Store> {
    return this.storeService.findOne(id);
  }

  @Post()
  async create(@Body() storeData: Partial<Store>): Promise<Store> {
    return this.storeService.create(storeData);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() storeData: Partial<Store>,
  ): Promise<Store> {
    return this.storeService.update(id, storeData);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.storeService.delete(id);
  }
}
