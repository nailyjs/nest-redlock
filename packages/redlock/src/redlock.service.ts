import { Inject, Injectable } from "@nestjs/common";
import Redlock from "redlock";
import type { RedlockModuleOptions } from "./redlock.module";
import { REDLOCK_MODULE_OPTIONS } from "./constant";

/**
 * Inherit all the Redlock methods, like `on`, and `off`.
 *
 * @export
 * @class RedlockService
 * @extends {Redlock}
 */
@Injectable()
export class RedlockService extends Redlock {
  constructor(
    /**
     * Current redlock module options.
     *
     * @type {RedlockModuleOptions}
     * @public
     * @readonly
     */
    @Inject(REDLOCK_MODULE_OPTIONS)
    public readonly redlockOptions: RedlockModuleOptions,
  ) {
    super(
      (redlockOptions || {}).clients || [],
      (redlockOptions || {}).options || {},
    );
  }
}
