import { BaseValidator } from "@/shared/http_handlers/base_validator";
import { injectable } from "inversify";

export const USER_VALIDATOR = Symbol.for('UserValidator')

@injectable()
export class UserValidator extends BaseValidator {
    protected schema: object = {
        "type": "object",
        additionalProperties: false,
        required: ['id', 'name', 'email'],
        "properties": {
            "id": { "type": "string" },
            "name": { "type": "string" },
            "email": { "type": "string" }
        }
    };
}