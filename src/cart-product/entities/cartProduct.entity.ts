import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CartEntity } from '../../cart/entities/cart.entity';
import { ProductEntity } from '../../product/entities/product.entity';

@Entity({ name: 'cart-product' })
export class CartProductEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'cart_id', nullable: false })
  cartId: number;

  @Column({ name: 'product_id', nullable: false })
  productId: number;

  @Column({ name: 'amount', nullable: false })
  amout: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(
    () => ProductEntity,
    (product: ProductEntity) => product.cartProducts,
  )
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product?: ProductEntity;

  @ManyToOne(() => CartEntity, (cart: CartEntity) => cart.id)
  @JoinColumn({ name: 'cart_id', referencedColumnName: 'id' })
  cart?: CartEntity;
}
