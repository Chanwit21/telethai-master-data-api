import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST') || 'localhost',
        port: parseInt(configService.get('DATABASE_PORT') || '5432'),
        username: configService.get('DATABASE_USER') || 'user',
        password: configService.get('DATABASE_PASSWORD') || 'password',
        database: configService.get('DATABASE_NAME') || 'telethai_master_data',
        entities: [`${__dirname}/../**/*.entity.js`],
        synchronize: false,
        logging: false,
      }),
    }),
  ],
})
export class DatabaseModule {}
