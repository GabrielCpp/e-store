import { EntityRepository, DeleteQueryBuilder, SelectQueryBuilder, UpdateQueryBuilder } from "typeorm";
import { UserDomain, QUERY_USER_BY_ID_DOMAIN } from "@/core/domains";
import { UserEntity, UserTable } from "../entities";
import { injectable, inject } from "inversify";
import { TableRepository, IRepository, FilterBuilder, UpdateFilterBuilder } from "@/sanityjs/repository-flavours";
import { IMapper, MAPPER } from "@/sanityjs/mapper";
import { USER_DOMAIN } from '../../core/domains/user-domain';
import { QueryUserByIdDomain } from '@/core/domains/query-user-by-id-domain';
import { uuidToBuffer } from "@/sanityjs";

@EntityRepository(UserTable)
export class UserRepository extends TableRepository<UserDomain, UserEntity> implements IRepository<UserDomain>  {
    @inject(MAPPER) protected mapper: IMapper;
    protected domain: Symbol = USER_DOMAIN;
    protected entity: new () => UserEntity = UserTable;
    protected deleteFilters = new Map<Symbol, FilterBuilder<DeleteQueryBuilder<UserEntity>>>([])
    protected queryFilters = TableRepository.createQueryFilters<UserEntity>([
        [QUERY_USER_BY_ID_DOMAIN, (q: QueryUserByIdDomain, b) => b.where('id = :id').setParameters({ id: uuidToBuffer(q.id) })]
    ])

    protected updateFilters = new Map<Symbol, UpdateFilterBuilder<UpdateQueryBuilder<UserEntity>, UserEntity>>([])
}