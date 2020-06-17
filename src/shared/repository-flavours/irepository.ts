
export interface IFilter {
    discriminator: Symbol;
}

export interface IRepository<TDomain> {
    add(...domains: TDomain[]): Promise<void>;
    removeBy(query: IFilter): Promise<void>
    findOneBy(query: IFilter): Promise<TDomain>;
    updateBy(query: IFilter, newDomain: Partial<TDomain>): Promise<void>;
    findBy(query: IFilter): Promise<TDomain[]>;
    findAll(): Promise<TDomain[]>
}