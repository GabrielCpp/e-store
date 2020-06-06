
import { IModelValidator } from './imodelvalidator';
import { Dictionary } from '../type-utils';
import Ajv from 'ajv'

export abstract class BaseValidator implements IModelValidator {
    protected abstract schema: object;
    private ajv = new Ajv();

    validate(data: Dictionary<unknown>): void {
        this.ajv.validate(this.schema, data);
    }
}