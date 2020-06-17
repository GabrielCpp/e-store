import { ContainerModule, interfaces } from "inversify";
import { logger } from "../logger";
import { LOGGER, ILogger } from "@/shared/logging/ilogger";

export const loggerModule = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    bind<ILogger>(LOGGER).toConstantValue(logger)
});