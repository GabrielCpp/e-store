import { IConfigurableMapping } from "./iconfigurable-mapping";

export interface IForwardMappingStep extends IConfigurableMapping {
    mapForward(obj: unknown, target: unknown): void
}
