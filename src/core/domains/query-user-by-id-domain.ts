
import { IFilter } from '@/sanityjs/repository-flavours/irepository';


export const QUERY_USER_BY_ID_DOMAIN = Symbol.for('QueryUserByIdDomain')

export interface QueryUserByIdDomain extends IFilter {
    id: string;
}