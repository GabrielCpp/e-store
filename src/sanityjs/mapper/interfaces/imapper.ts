export type TypeIdentifier = Symbol | (new (...p: unknown[]) => unknown) | ((...p: unknown[]) => unknown)

export const MAPPER = Symbol.for('IMapper')

export interface IMapper {
    map<T, U>(obj: T, from: TypeIdentifier, to: TypeIdentifier): U;
}
