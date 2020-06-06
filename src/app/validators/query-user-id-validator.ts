import { BaseValidator } from "@/sanityjs/http_handlers/base_validator";

export const QUERY_USER_BY_ID_VALIDATOR = Symbol.for('QueryUserByIdValidator')

export class QueryUserByIdValidator extends BaseValidator {
    protected schema: object = {
        "type": "object",
        "properties": {
            "id": { "type": "string" }
        }
    };
}