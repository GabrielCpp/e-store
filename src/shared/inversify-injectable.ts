import { injectable, inject } from "inversify"

export function bindInjectable(Class: any, parameters: any[]) {
    const x = injectable()(Class)
    parameters.forEach((p, i) => inject(p)(Class, undefined as any, i))
    return x
}
