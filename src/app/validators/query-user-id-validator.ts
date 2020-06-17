import { BaseValidator } from "@/shared/http_handlers/base_validator";

export const QUERY_USER_BY_ID_VALIDATOR = Symbol.for('QueryUserByIdValidator')

export class QueryUserByIdValidator extends BaseValidator {
    protected schema: object = {
        "type": "object",
        required: ['id'],
        "properties": {
            "id": { "type": "string" }
        }
    };
}