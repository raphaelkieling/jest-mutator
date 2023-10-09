import { mutate } from "./jest";
import { sum, divideGlobalStatic } from "./fixtures/arithmetic";

jest.mock("./fixtures/arithmetic", () => jest.requireActual("./fixtures/arithmetic"))

describe("jest", () => {
    mutate(sum)("should be able to run a simple sum test", () => {
        expect(1).toBe(1)
    })

    mutate(divideGlobalStatic)("should be able to run a class", () => {
        expect(1).toBe(1)
    })
});
