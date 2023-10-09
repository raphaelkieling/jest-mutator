import path from "node:path"
import fs from "node:fs"
import { Mutator } from "./mutator";
import { SyntaxKind } from "ts-morph";

describe("mutationPoint", () => {
  const payload = fs.readFileSync(path.join(__dirname, "fixtures", "arithmetic.ts")).toString()
  describe("arithmetic", () => {
    it("should get all the possible mutation points", () => {
      const mutationPoint = new Mutator({ supportedKinds: [SyntaxKind.BinaryExpression] })
      const createSpy= jest.spyOn(mutationPoint, "createMutantCombinations")
      mutationPoint.mutate(payload);

      const calledWith = createSpy.mock.calls[0][0]
      expect(calledWith.length).toBe(6)
    })

    it("should return 0 if don't match any kind", () => {
      const mutationPoint = new Mutator({ supportedKinds: [SyntaxKind.AbstractKeyword] })
      const createSpy= jest.spyOn(mutationPoint, "createMutantCombinations")
      mutationPoint.mutate(payload);

      const calledWith = createSpy.mock.calls[0][0]
      expect(calledWith.length).toBe(0)
    })
  });
});
