import { Repository, DeleteQueryBuilder, SelectQueryBuilder, UpdateQueryBuilder, ObjectType, getRepository } from "typeorm"
import { IRepository, IFilter } from "./irepository"
import { IMapper, TypeIdentifier } from "../mapper"
import { newCustomError } from "../error";

export type FilterBuilder<TBuilder> = (query: IFilter, builder: TBuilder) => TBuilder;
export type UpdateFilterBuilder<TBuilder, TEntity> = (query: IFilter, entity: TEntity, builder: TBuilder) => TBuilder;

export abstract class TableRepository<TDomain, TEntity> implements IRepository<TDomain> {
    protected abstract mapper: IMapper
    protected abstract domain: TypeIdentifier
    protected abstract entity: new () => TEntity
    protected abstract deleteFilters: Map<TypeIdentifier, FilterBuilder<DeleteQueryBuilder<TEntity>>>
    protected abstract queryFilters: Map<TypeIdentifier, FilterBuilder<SelectQueryBuilder<TEntity>>>
    protected abstract updateFilters: Map<TypeIdentifier, UpdateFilterBuilder<UpdateQueryBuilder<TEntity>, TEntity>>

    public static createDeleteFilters<T>(filter: Array<[TypeIdentifier, (query: any, builder: DeleteQueryBuilder<T>) => DeleteQueryBuilder<T>]>): Map<TypeIdentifier, FilterBuilder<DeleteQueryBuilder<T>>> {
        return new Map<TypeIdentifier, FilterBuilder<DeleteQueryBuilder<T>>>([
            ...(filter as [TypeIdentifier, FilterBuilder<DeleteQueryBuilder<T>>][])
        ])
    }

    public static createQueryFilters<T>(filter: Array<[TypeIdentifier, (query: any, builder: SelectQueryBuilder<T>) => SelectQueryBuilder<T>]>): Map<TypeIdentifier, FilterBuilder<SelectQueryBuilder<T>>> {
        return new Map<TypeIdentifier, FilterBuilder<SelectQueryBuilder<T>>>([
            ...(filter as [TypeIdentifier, FilterBuilder<SelectQueryBuilder<T>>][])
        ])
    }

    public static createUpdateFilters<T>(filter: Array<[TypeIdentifier, (query: any, entity: T, builder: UpdateQueryBuilder<T>) => UpdateQueryBuilder<T>]>): Map<TypeIdentifier, UpdateFilterBuilder<UpdateQueryBuilder<T>, T>> {
        return new Map<TypeIdentifier, UpdateFilterBuilder<UpdateQueryBuilder<T>, T>>([
            ...(filter as [TypeIdentifier, UpdateFilterBuilder<UpdateQueryBuilder<T>, T>][])
        ])
    }

    public async add(...domains: TDomain[]): Promise<void> {
        const entities = domains.map(d => this.mapper.map<TDomain, TEntity>(d, this.domain, this.entity))
        const query = getRepository(this.entity).createQueryBuilder().insert().values(entities);
        await query.execute()
    }

    public async removeBy(filter: IFilter): Promise<void> {
        const invokeBuilder = this.deleteFilters.get(filter.discriminator);

        if (invokeBuilder === undefined) {
            throw newCustomError('NoRemoveQueryFound', `Not query found for id ${filter.discriminator}`)
        }

        let deleteQueryBuilder = getRepository(this.entity).createQueryBuilder().delete().from(this.entity);
        deleteQueryBuilder = invokeBuilder(filter, deleteQueryBuilder);

        await deleteQueryBuilder.execute();
    }

    public async findOneBy(filter: IFilter): Promise<TDomain> {
        const findQueryBuilder = this._buildFindQuery(filter)
        const result = await findQueryBuilder.getOne()

        if (result === undefined) {
            throw newCustomError('NoMatchingResult', `Not result found for query ${findQueryBuilder.getSql()}`)
        }

        const mappedResult = this.mapper.map<TEntity, TDomain>(result, this.entity, this.domain)
        return mappedResult
    }

    public async updateBy(filter: IFilter, newDomain: Partial<TDomain>): Promise<void> {
        const invokeBuilder = this.updateFilters.get(filter.discriminator);

        if (invokeBuilder === undefined) {
            throw new Error()
        }

        const entity = this.mapper.map<Partial<TDomain>, TEntity>(newDomain, this.entity, this.domain)
        let updateQueryBuilder = getRepository(this.entity).createQueryBuilder().update(this.entity);
        updateQueryBuilder = invokeBuilder(filter, entity, updateQueryBuilder)

        await updateQueryBuilder.execute()
    }

    public async findBy(filter: IFilter): Promise<TDomain[]> {
        const findQueryBuilder = this._buildFindQuery(filter)
        const results = await findQueryBuilder.getMany()
        const mappedResults = results.map(e => this.mapper.map<TEntity, TDomain>(e, this.entity, this.domain))
        return mappedResults
    }

    public async findAll(): Promise<TDomain[]> {
        const entities = await getRepository(this.entity).find();
        const domains = entities.map(e => this.mapper.map<TEntity, TDomain>(e, this.entity, this.domain))
        return domains
    }

    private _buildFindQuery(filter: IFilter): SelectQueryBuilder<TEntity> {
        const invokeBuilder = this.queryFilters.get(filter.discriminator);

        if (invokeBuilder === undefined) {
            throw newCustomError('NoFindQueryFound', `Not query found for id ${filter.discriminator}`)
        }

        let findQueryBuilder = getRepository(this.entity).createQueryBuilder();
        findQueryBuilder = invokeBuilder(filter, findQueryBuilder)

        return findQueryBuilder;
    }
}