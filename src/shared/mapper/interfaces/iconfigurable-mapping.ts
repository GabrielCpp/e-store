import { TypeIdentifier, IMapper } from "./imapper";

export interface IConfigurableMapping {
    configure(source: TypeIdentifier, destination: TypeIdentifier, mapper: IMapper): void;
}