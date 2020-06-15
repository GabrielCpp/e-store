import { zip } from 'lodash';
import assert from 'assert';

type ValueCompare = (v: unknown) => boolean;
type ProduceResult = () => unknown

interface MethodSetup {
    signature: ValueCompare[]
    getResult: ProduceResult;
}

class SetupProxy {
    public params: unknown[] | undefined
    public prop: string | number | symbol | undefined
    private proxy: unknown;

    public constructor() {
        this.proxy = new Proxy({}, {
            get: (target, prop, receiver) => {
                this.prop = prop;
                this.params = undefined
                return (...params: unknown[]) => {
                    this.params = params
                }
            }
        })
    }

    public forProxy<T>() {
        this.prop = undefined
        this.params = undefined
        return this.proxy as T;
    }
}

export class SetupResult {
    public constructor(private setResult: (result: ProduceResult) => void) {

    }

    public return(value: unknown) {
        this.setResult(() => value)
    }

    public throwError(error: Error) {
        this.setResult(() => {
            throw error
        })
    }

    public reject(error: Error) {
        this.setResult(() => Promise.reject(error))
    }

    public resolve(value: unknown) {
        this.setResult(() => Promise.resolve(value))
    }
}

export class ClassMock<T extends object> {
    private methods = new Map<string | number | symbol, MethodSetup[]>();
    private properties = new Map<string | number | symbol, ProduceResult>();
    private settedProperties = new Map<string | number | symbol, ValueCompare>();
    private setupProxy = new SetupProxy()

    public setup(x: (x: T) => void): SetupResult {
        x(this.setupProxy.forProxy<T>())

        if (this.setupProxy.prop === undefined) {
            throw new Error(`You must setup something`)
        }

        if (this.setupProxy.params === undefined) {
            throw new Error(`Invocation required`)
        }

        const signature: ValueCompare[] = []
        for (const param of this.setupProxy.params) {
            signature.push(x => x === param)
        }

        let method = this.methods.get(this.setupProxy.prop)

        if (method === undefined) {
            method = []
            this.methods.set(this.setupProxy.prop, method)
        }

        const methodSetup: MethodSetup = { signature, getResult: () => undefined };
        method.push(methodSetup)

        return new SetupResult((getResult) => {
            methodSetup.getResult = getResult
        })
    }

    public setupGet(x: (x: T) => void): SetupResult {
        x(this.setupProxy.forProxy<T>())

        const prop = this.setupProxy.prop

        if (prop === undefined) {
            throw new Error(`You must setup something`)
        }

        this.properties.set(prop, () => undefined)

        return new SetupResult((getResult) => this.properties.set(prop, getResult))
    }

    public get object(): T {
        return new Proxy({} as T, {
            get: (target, prop, receiver) => {
                const method = this.methods.get(prop)
                if (method !== undefined) {
                    return (...params: unknown[]) => this.matchMethod(method, params)
                }

                const property = this.properties.get(prop)
                if (property !== undefined) {
                    return property()
                }

                throw new Error(`No matching method or property ${prop.toString()}`)

            },
            set: (object, key, value, proxy) => {
                const isValueEqual = this.settedProperties.get(key)
                if (isValueEqual !== undefined) {
                    if (!isValueEqual(value)) {
                        throw new Error(`Setter setted mismatch value`)
                    }
                }
                else {
                    throw new Error(`No setter defined for ${key.toString()}`)
                }

                return true;
            }
        })
    }

    private matchMethod(setups: MethodSetup[], params: unknown[]): unknown {
        for (const setup of setups) {
            if (setup.signature.length !== params.length) {
                continue
            }

            if (this.isSignatureMatch(setup.signature, params)) {
                return setup.getResult()
            }
        }

        throw new Error(`No method matching`)
    }

    private isSignatureMatch(signature: ValueCompare[], params: unknown[]): boolean {
        let isSignatureMatch = true;

        for (const [paramMatcher, param] of zip(signature, params)) {
            assert.ok(paramMatcher)
            if (!paramMatcher(param)) {
                isSignatureMatch = false;
                break;
            }
        }

        return isSignatureMatch
    }
}