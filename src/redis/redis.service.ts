import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createClient } from 'redis';
import type { RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;

  async onModuleInit() {
    this.client = createClient({
      url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
    });

    this.client.on('error', (err) => console.error('Redis Client Error:', err));

    await this.client.connect();
    console.log('✅ Redis connected');
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.disconnect();
      console.log('Redis disconnected');
    }
  }

  getClient(): RedisClientType {
    return this.client;
  }
}
