import { IMapper } from "./imapper";
import { Mapping } from '../mapping'

export interface IMappingBuilder {
    build(mapper: IMapper): Mapping[]
}
