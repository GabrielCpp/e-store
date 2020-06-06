

export const USER_DTO = Symbol.for('UserDto')

export interface UserDto {
    id: string;
    name: string;
    email: string;
}