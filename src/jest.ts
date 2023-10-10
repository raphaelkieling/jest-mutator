import logger from "./logger"
import * as fs from "fs"
import { Mutator } from "./mutator"

interface WrapperParams {
    name: string,
    fileContext?: string,
    rootObject: any,
    rootObjectFn: string,
    jestFn: any
}

function wrappedFn(params: WrapperParams): void {
    const mutator = new Mutator()

    // original checking, if fails, the test fails since jest.expect will throw an error
    params.jestFn()

    const originalFn = (params.rootObject.prototype ?? params.rootObject)[params.rootObjectFn]
    const combinations = mutator.getMutationCombinations(params?.fileContext ?? originalFn.toString())

    // Mutations verifications all of them should fails
    combinations.forEach((node: any) => {
        try {
            // console.log(node)
            const mutateFn = mutator.mutateFunction(node, params.rootObjectFn)

            console.log(mutateFn.toString())
            logger.debug(`(${mutateFn.toString()})`)

            // eslint-disable-next-line no-eval
            params.rootObject[params.rootObjectFn] = eval(`(${mutateFn.toString()})`).bind(params.rootObject)
            params.jestFn()
        } catch(err: any) {
            if("matcherResult" in err) {
                return
            }

            logger.debug(err)

            // to avoid jest to show the stack trace of the mutation
            const error = new  Error(`${params.name}: mutation success, must fail`)
            error.stack = err.stack
            throw error
        }
    })
}


export function mutate(rootObject: any, rootObjectFn: string, fileContext?: string): (name: string, jestFn: any) => void {
    return  (name: string, jestFn: any): void => {
        // should have an empty one to run the original test'
        it(name, (): void => { wrappedFn({ name, rootObject, rootObjectFn, jestFn, fileContext }) })
    }
}

export function mutationContext(filePath: string): typeof mutate {
    const data = fs.readFileSync(filePath, "utf8")
    return  (rootObject: any, rootObjectFn: string) => mutate(rootObject, rootObjectFn, data)
}
