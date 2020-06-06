import { ContainerModule, interfaces } from "inversify";
import { IMapper, MAPPER, Mapper } from "@/sanityjs";
import * as appMappers from '@/app/mappings'
import * as infraMappers from '@/infrastructure/mappings'

function buildMapper(): IMapper {
    const mapper = new Mapper();
    mapper.addMappers(...Object.values(appMappers))
    mapper.addMappers(...Object.values(infraMappers))

    return mapper;
}

export const mapperModule = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    bind<IMapper>(MAPPER).toConstantValue(buildMapper())
});