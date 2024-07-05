import type {
  DynamicModule,
  InjectionToken,
  OptionalFactoryDependency,
  Provider,
  Type,
} from "@nestjs/common";
import { Module } from "@nestjs/common";
import type Redlock from "redlock";
import { RedlockService } from "./redlock.service";
import { REDLOCK_MODULE_OPTIONS } from "./constant";

export interface CompatibleRedisClient {
  eval: (...args: unknown[]) => Promise<unknown>;
}

export interface RedlockModuleOptions {
  /**
   * you should have one client for each independent redis node
   *
   * @type {CompatibleRedisClient[]}
   * @memberof RedlockModuleOptions
   */
  clients: CompatibleRedisClient[];
  /**
   * optionally customize settings (advanced use only)
   *
   * @type {Redlock.Options}
   * @memberof RedlockModuleOptions
   */
  options?: Redlock.Options;
}

type InferArrayItem<T> = T extends Array<infer U> ? U : never;
export interface RedlockModuleAsyncOptions<Injects extends unknown[]> {
  useFactory: (
    ...args: InferArrayItem<Injects> extends Type
      ? InstanceType<InferArrayItem<Injects>>[]
      : Injects
  ) => RedlockModuleOptions;
  inject?: Injects;
}

@Module({})
export class RedlockModule {
  public static forRoot(options: RedlockModuleOptions): DynamicModule {
    const providers: Provider[] = [
      {
        provide: RedlockService,
        useValue: new RedlockService(options),
      },
      {
        provide: REDLOCK_MODULE_OPTIONS,
        useValue: options || {},
      },
    ];

    return {
      module: RedlockModule,
      exports: [...providers],
      providers: [...providers],
      global: true,
    };
  }

  public static forRootAsync<
    Injects extends (InjectionToken | OptionalFactoryDependency)[],
  >(options: RedlockModuleAsyncOptions<Injects>): DynamicModule {
    const providers: Provider[] = [
      {
        provide: RedlockService,
        useFactory: (options: RedlockModuleOptions) =>
          new RedlockService(options),
        inject: [REDLOCK_MODULE_OPTIONS],
      },
      {
        provide: REDLOCK_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      },
    ];

    return {
      module: RedlockModule,
      exports: [...providers],
      providers: [...providers],
      global: true,
    };
  }
}
