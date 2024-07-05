import { Module } from '@nestjs/common';
import { RedlockModule } from '@nailyjs.nest.modules/redlock';
import Redis from 'ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      cache: true,
    }),
    RedlockModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configService) {
        const REDIS_HOST: string = configService.getOrThrow('REDIS_HOST');
        if (typeof REDIS_HOST !== 'string')
          throw new TypeError('REDIS_HOST must be a string');
        const REDIS_PORT: string = configService.getOrThrow('REDIS_PORT');
        if (typeof REDIS_PORT !== 'string' || Number.isNaN(Number(REDIS_PORT)))
          throw new TypeError('REDIS_PORT must be a number string');
        const REDIS_PASSWORD: string =
          configService.getOrThrow('REDIS_PASSWORD');
        if (typeof REDIS_PASSWORD !== 'string')
          throw new TypeError('REDIS_PASSWORD must be a string');

        return {
          clients: [
            new Redis({
              host: REDIS_HOST,
              port: Number(REDIS_PORT),
              password: REDIS_PASSWORD,
            }),
          ],
          options: {
            retryCount: 10,
            retryDelay: 200,
            retryJitter: 200,
          },
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
