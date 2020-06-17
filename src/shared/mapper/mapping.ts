import { TypeIdentifier } from "./interfaces";

export type MappingStep = (obj: unknown, target: unknown) => void;

export interface Mapping {
    source: TypeIdentifier;
    destination: TypeIdentifier
    steps: MappingStep[];
}

export function newMapping(
    source: TypeIdentifier,
    destination: TypeIdentifier,
    steps: MappingStep[]
) {
    return {
        source,
        destination,
        steps
    }
}