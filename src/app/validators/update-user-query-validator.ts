import { BaseValidator } from "@/sanityjs/http_handlers/base_validator";

export const UPDATE_USER_VALIDATOR = Symbol.for('UpdateUserQueryValidator')

export class UpdateUserQueryValidator extends BaseValidator {
    protected schema: object = {
        "definitions": {
            "partial-user": {
                "type": "object",
                "properties": {
                    "id": { "type": "string" },
                    "name": { "type": "string" },
                    "email": { "type": "string" }
                }
            }
        },
        "type": "object",
        "required": ['id'],
        "properties": {
            "id": { "type": "string" },
            "payload": { "$ref": "#/definitions/partial-user" }
        }
    };
}