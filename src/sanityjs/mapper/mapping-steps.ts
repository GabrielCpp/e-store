
import { IReverseMapping } from './interfaces/ireverse-mapping';
import { TypeIdentifier, IMapper } from './interfaces';
import { Dictionary } from '../type-utils';
import { IForwardMappingStep } from './interfaces/iforward-mapping-step';


export class AssignObject implements IReverseMapping {
    public configure(source: TypeIdentifier, destination: TypeIdentifier, mapper: IMapper): void {

    }

    public mapBackward(obj: unknown, target: unknown): void {
        Object.assign(target as object, obj as object);
    }


    public mapForward(obj: unknown, target: unknown): void {
        Object.assign(target as object, obj as object);
    }
}

export class SetConstant implements IForwardMappingStep {
    public constructor(private memberName: string, private value: unknown) {

    }

    public configure(source: TypeIdentifier, destination: TypeIdentifier, mapper: IMapper): void {

    }

    public mapForward(obj: unknown, target: unknown): void {
        (target as Dictionary<unknown>)[this.memberName] = this.value
    }
}

export class DirectCopies implements IReverseMapping {
    private memberNames: string[];

    public constructor(...memberNames: string[]) {
        this.memberNames = memberNames;
    }

    public configure(source: TypeIdentifier, destination: TypeIdentifier, mapper: IMapper): void {

    }

    public mapBackward(obj: unknown, target: unknown): void {
        for (const memberName of this.memberNames) {
            (target as Dictionary<unknown>)[memberName] = (obj as Dictionary<unknown>)[memberName];
        }
    }

    public mapForward(obj: unknown, target: unknown): void {
        for (const memberName of this.memberNames) {
            (target as Dictionary<unknown>)[memberName] = (obj as Dictionary<unknown>)[memberName];
        }
    }
}

export class DirectCopy implements IReverseMapping {
    public constructor(public memberName: string) {

    }

    public configure(source: TypeIdentifier, destination: TypeIdentifier, mapper: IMapper): void {

    }

    public mapBackward(obj: unknown, target: unknown): void {
        (target as Dictionary<unknown>)[this.memberName] = (obj as Dictionary<unknown>)[this.memberName];
    }


    public mapForward(obj: unknown, target: unknown): void {
        (target as Dictionary<unknown>)[this.memberName] = (obj as Dictionary<unknown>)[this.memberName];
    }
}

export class RenameField implements IReverseMapping {
    public constructor(public fromMemberName: string, public toMemberName: string) {

    }

    public configure(source: TypeIdentifier, destination: TypeIdentifier, mapper: IMapper): void {

    }

    public mapBackward(obj: unknown, target: unknown): void {
        (obj as Dictionary<unknown>)[this.toMemberName] = (target as Dictionary<unknown>)[this.fromMemberName];
    }


    public mapForward(obj: unknown, target: unknown): void {
        (target as Dictionary<unknown>)[this.toMemberName] = (obj as Dictionary<unknown>)[this.fromMemberName];
    }
}

export class ConvertTwowWays implements IReverseMapping {
    public constructor(
        private fromMemberName: string,
        private toMemberName: string,
        private convertForward: (v: unknown) => unknown,
        private convertBackward: (v: unknown) => unknown
    ) {

    }

    public configure(source: TypeIdentifier, destination: TypeIdentifier, mapper: IMapper): void {

    }

    public mapBackward(obj: unknown, target: unknown): void {
        (target as Dictionary<unknown>)[this.toMemberName] = this.convertBackward((obj as Dictionary<unknown>)[this.fromMemberName]);
    }


    public mapForward(obj: unknown, target: unknown): void {
        (target as Dictionary<unknown>)[this.toMemberName] = this.convertForward((obj as Dictionary<unknown>)[this.fromMemberName]);
    }
}