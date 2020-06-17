import { IForwardMappingStep } from "./iforward-mapping-step";

export interface IReverseMapping extends IForwardMappingStep {
    mapBackward(obj: unknown, target: unknown): void
}
