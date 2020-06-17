
import { IModelValidator } from './imodelvalidator';
import { Dictionary } from '../type-utils';
import Ajv from 'ajv'
import { ValidationError } from './errors/validation-error';

export abstract class BaseValidator implements IModelValidator {
    protected abstract schema: object;
    private ajv = new Ajv({
        allErrors: true,
        loadSchema: (uri: string) => {
            throw new Error(`No schema for ${uri}`)
        }
    });

    private ajvValidate: Ajv.ValidateFunction

    public static async create<T extends BaseValidator>(validatorClass: new () => T): Promise<T> {
        const validator = new (validatorClass)()
        await validator.compile()
        return validator;
    }

    public async compile() {
        this.ajvValidate = await this.ajv.compileAsync(this.schema)
    }

    validate(data: Dictionary<unknown>): void {
        this.ajvValidate(data);

        if (this.ajvValidate.errors !== null && this.ajvValidate.errors !== undefined) {
            throw ValidationError.create({ errors: [...this.ajvValidate.errors] })
        }
    }
}