import { Module } from '@nestjs/common';
import { CartProductService } from './cart-product.service';
import { CartProductController } from './cart-product.controller';

@Module({
  controllers: [CartProductController],
  providers: [CartProductService]
})
export class CartProductModule {}
