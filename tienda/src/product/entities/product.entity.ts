import { Store } from 'src/store/entities/store.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column('decimal')
  precio: number;

  @Column()
  tipo: string;

  @ManyToMany(() => Store, (store) => store.productos)
  @JoinTable()
  tiendas: Store[];

  public static createProduct(
    id: number | undefined,
    nombre: string,
    precio: number,
    tipo: string,
  ): Product {
    const product = new Product();
    if (id !== undefined) {
      product.id = id;
    }
    product.nombre = nombre;
    product.precio = precio;
    product.tipo = tipo;
    return product;
  }
}
