
import { Dictionary } from '../type-utils';
export interface IModelValidator {
    validate(instance: Dictionary<unknown>): void;
}