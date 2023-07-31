import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
} from 'typeorm';
import { CartProductEntity } from '../../cart-product/entities/cartProduct.entity';

@Entity({ name: 'cart' })
export class CartEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'user_id', nullable: false })
  userId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(
    () => CartProductEntity,
    (cartProduct: CartProductEntity) => cartProduct.cartId,
  )
  cartProducts?: CartProductEntity[];
}
