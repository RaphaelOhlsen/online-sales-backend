import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheModule as CacheModuleNest } from '@nestjs/cache-manager';

// ttl can have a value from 1 to 2147483646, expressed in milliseconds.
const ttl = 214748364;

@Module({
  imports: [CacheModuleNest.register({ ttl })],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
