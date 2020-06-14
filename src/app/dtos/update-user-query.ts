import { UserDto } from './user-dto';
import { QueryUserByIdDto } from './query-user-id-dto';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

export const UPDATE_USER_QUERY_DTO = Symbol.for('UpdateUserQueryDto');

export interface UpdateUserQueryDto extends QueryUserByIdDto {
    payload: Partial<UserDto>
}

@ApiModel({
    name: 'PartialUser',
    description: '',
})
export class PartialUserModel implements Omit<UserDto, 'id'> {
    @ApiModelProperty({
        description: '',
        required: false,
    })
    name: string;

    @ApiModelProperty({
        description: '',
        required: false,
    })
    email: string;
}