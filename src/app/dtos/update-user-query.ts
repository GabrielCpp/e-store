import { UserDto } from './user-dto';
import { QueryUserByIdDto } from './query-user-id-dto';

export const UPDATE_USER_QUERY_DTO = Symbol.for('UpdateUserQueryDto');

export interface UpdateUserQueryDto extends QueryUserByIdDto {
    payload: Partial<UserDto>
}