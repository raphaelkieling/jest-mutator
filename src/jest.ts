import { Mutator } from "./mutator"


function wrappedFn(name: string, mutateFn:any, fn: any): void {
    const mutator = new Mutator()

    // original checking, if fails, the test fails since jest.expect will throw an error
    // TODO: add the .each props? add the context props, is it possible?
    fn()
    const combinations = mutator.getMutationCombinations(mutateFn.toString())

    // Mutations verifications all of them should fails
    combinations.forEach((node: any) => {
        try {
            fn()
        } catch(err: any) {
            // to avoid jest to show the stack trace of the mutation
            const error = new  Error(`${name}: mutation failed`)
            error.stack = err.stack
            throw error
        }
    })
}


export function mutate(toMutateFn: (...args: any) => any): (name: string, jestFn: any) => void {
    return  (name: string, jestFn: any): void => {
        // should have an empty one to run the original test
        it(name, (): void => { wrappedFn(name, toMutateFn, jestFn) })
    }
}
