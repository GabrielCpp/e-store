import { IMapper, TypeIdentifier, IMappingBuilder } from "./interfaces";
import { MappingStep } from './mapping'

export class Mapper implements IMapper {
    private mappings = new Map<TypeIdentifier, Map<TypeIdentifier, MappingStep[]>>();

    public addMapper(mapping: IMappingBuilder) {
        const mappings = mapping.build(this)

        for (const mapping of mappings) {
            let toMapper = this.mappings.get(mapping.source)

            if (toMapper === undefined) {
                toMapper = new Map<TypeIdentifier, MappingStep[]>();
                this.mappings.set(mapping.source, toMapper)
            }

            toMapper.set(mapping.destination, mapping.steps)
        }
    }

    public addMappers(...mapping: IMappingBuilder[]) {
        mapping.forEach(m => this.addMapper(m))
    }

    public map<T, U>(obj: T, from: TypeIdentifier, to: TypeIdentifier): U {
        const toMapper = this.mappings.get(from)

        if (toMapper === undefined) {
            throw new Error(`No mapping for ${from.toString()}`)
        }

        const steps = toMapper.get(to)

        if (steps === undefined) {
            throw new Error(`No mapping for ${to.toString()}`)
        }

        const mappedObj = {}

        for (const step of steps) {
            step(obj, mappedObj)
        }

        return mappedObj as U;
    }
} 