
import { USER_DTO, QUERY_USER_BY_ID_DTO } from './dtos';
import { USER_DOMAIN, QUERY_USER_BY_ID_DOMAIN } from '@/core/domains';
import { DirectCopies, SetConstant } from '@/sanityjs';
import { PartialMapper } from '@/sanityjs';

export const userDomainEntityMapping = new PartialMapper(USER_DTO, USER_DOMAIN, [
    new DirectCopies('id', 'name', 'email')
])

export const userQueryByIdDomainEntityMapping = new PartialMapper(QUERY_USER_BY_ID_DTO, QUERY_USER_BY_ID_DOMAIN, [
    new DirectCopies('id'),
], [
    new SetConstant('discriminator', QUERY_USER_BY_ID_DOMAIN)
])