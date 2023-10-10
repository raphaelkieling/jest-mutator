import { mutate, mutationContext } from "./jest";
import * as path from "path"
import * as arithmetic from "./fixtures/arithmetic";

const mutationArithmetic = mutationContext(path.resolve(__dirname, "./fixtures/arithmetic.ts"))

describe("jest", () => {
    // mutate(arithmetic, "sum")("should be able to run a simple sum test", () => {
    //     const result = arithmetic.sum(1, 2)
    //     expect(result).toBe(3)
    // })

    it.todo("should run using it.skip")
    it.todo("should run using it.skip")
    it.todo("should run using it.skip")
    it.todo("should run using it.todo")
    it.todo("should run using it")
    it.todo("should run for a function that has imports and exports")
    it.todo("should run with import inside the function")
    it.todo("should run with spyOn")


    // mutate(arithmetic.Calculate, "sum")("should be able to run a class", () => {
    //     const result = new arithmetic.Calculate().sum(1, 2)
    //     expect(result).toBe(3)
    // })

    mutationArithmetic(arithmetic.Calculate, "sum")("should be able to run a class again", () => {
        const result = new arithmetic.Calculate().sum(3, 3)
        expect(result).toBe(6)
    })

    // mutate(arithmetic, "divideWithVariables")("should run for internal lets", () => {
    //     const result = arithmetic.divideWithVariables(10, 2)
    //     expect(result).toBe(5)
    // })

    // mutationArithmetic(arithmetic, "divideGlobalStatic")("should run for global static props", () => {
    //     const result = arithmetic.divideGlobalStatic(10, 2)
    //     expect(result).toBe(5)
    // })
});
