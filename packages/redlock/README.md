# 🔒 Redlock module for nest.js

## Install

```bash
pnpm i @nailyjs.nest.modules/redlock
```

# Use in your app.module.ts

```ts
import { RedlockModule } from "@nailyjs.nest.modules/redlock";
import { Redis } from "ioredis";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    RedlockModule.forRoot({
      clients: [
        new Redis({
          /* Redis options */
        }),
      ],
      options: {
        /* Redlock options */
      },
    }),
  ],
})
export class AppModule {}
```

Also you can use `forRootAsync`:

```ts
import { RedlockModule } from "@nailyjs.nest.modules/redlock";
import { Redis } from "ioredis";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    RedlockModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configService) {
        return {
          clients: [
            new Redis({
              /* Redis options */
            }),
          ],
          options: {
            /* Redlock options */
          },
        };
      },
    }),
  ],
})
export class AppModule {}
```

> The `useFactory`'s `configService` argument we use some logic, it will infer to `inject`'s instance type to help you write code.

In the business service:

```ts
import { Injectable } from "@nestjs/common";
import { RedlockService } from "@nailyjs.nest.modules/redlock";

@Injectable()
export class AppService {
  constructor(private readonly redlockService: RedlockService) {}
}
```

`RedlockService` extended `Redlock` class, so you can directly to call original redlock methods.
