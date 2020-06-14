
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

export const USER_DTO = Symbol.for('UserDto')

export interface UserDto {
    id: string;
    name: string;
    email: string;
}

@ApiModel({
    name: 'User',
    description: '',
})
export class UserModel implements UserDto {
    @ApiModelProperty({
        description: '',
        required: true,
    })
    id: string;

    @ApiModelProperty({
        description: '',
        required: true,
    })
    name: string;

    @ApiModelProperty({
        description: '',
        required: true,
    })
    email: string;
}