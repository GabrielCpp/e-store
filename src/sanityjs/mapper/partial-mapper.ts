import { IMappingBuilder, IMapper, TypeIdentifier, IForwardMappingStep, IReverseMapping } from "./interfaces";
import { Mapping, newMapping } from "./mapping";


export class PartialMapper implements IMappingBuilder {
    public constructor(
        public source: TypeIdentifier,
        public destination: TypeIdentifier,
        public commonSteps: IReverseMapping[],
        public mapForwards: IForwardMappingStep[] = [],
        public mapBackwards: IForwardMappingStep[] = []
    ) {

    }

    public build(mapper: IMapper): Mapping[] {
        const mappings: Mapping[] = []

        this.commonSteps.forEach(x => x.configure(this.source, this.destination, mapper))
        this.mapForwards.forEach(x => x.configure(this.source, this.destination, mapper))
        this.mapBackwards.forEach(x => x.configure(this.source, this.destination, mapper))

        if (this.commonSteps.length > 0 || this.mapForwards.length > 0) {
            mappings.push(newMapping(this.source, this.destination, [
                ...this.commonSteps.map(x => x.mapForward.bind(x)),
                ...this.mapForwards.map(x => x.mapForward.bind(x)),
            ]))
        }

        if (this.commonSteps.length > 0 || this.mapBackwards.length > 0) {
            mappings.push(newMapping(this.destination, this.source, [
                ...this.commonSteps.map(x => x.mapBackward.bind(x)),
                ...this.mapBackwards.map(x => x.mapForward.bind(x)),
            ]))
        }

        return mappings
    }
}