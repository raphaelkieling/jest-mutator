import * as morph from "ts-morph";
import * as tsNode from "ts-node";
import { dynamicImport } from "tsimportlib";

import logger from "./logger";

interface MutationCombination {
  type: morph.SyntaxKind;
  node: morph.Node;
  operator: string;
}

interface MutatorParams {
  supportedKinds: morph.SyntaxKind[]
}

// TODO: computed mutation points by type
// TODO: create a possibility to create a config file or function to handle dafault props
export class Mutator {
  private readonly mutationPoints: morph.Node[] = []
  private readonly mutationCombinations: MutationCombination[] = []
  private readonly supportedKinds: morph.SyntaxKind[] = [
    morph.SyntaxKind.BinaryExpression
  ]

  constructor(params?: MutatorParams) {
    if(params?.supportedKinds !== undefined) {
      this.supportedKinds = params?.supportedKinds
    }
  }

  private walkNodeChild(node?: morph.Node): void {
    if(node === undefined) return;

    if(this.supportedKinds.includes(node.getKind())) {
      this.mutationPoints.push(node)
    }

    node.forEachChild((child) => {
      this.walkNodeChild(child)
    })
  }

  private getAllSourceMutationPoints(source?: morph.SourceFile): morph.Node[] {
    source?.forEachChild((node) => {
      this.walkNodeChild(node)
    })

    return this.mutationPoints
  }

  // TODO: add possibility for multiple mutation combinations in the same combination
  // TODO: create a mutation combination class to handle the combinations
  // TODO: add max combinations to avoid memory / performance issues
  // TODO: clone and change left / right and add more operators
  // TODO: create random modifications instead of generate thousands of combinations, maybe a class prop to allow it?
  private createMutantCombinations(nodes: morph.Node[]): any[] {
    nodes.forEach((node) => {
      if(node.getKind() === morph.SyntaxKind.BinaryExpression) {
        const binaryExpression = node

        this.mutationCombinations.push({
          type: morph.SyntaxKind.BinaryExpression,
          node: binaryExpression,
          operator: "*",
        })

        this.mutationCombinations.push({
          type: morph.SyntaxKind.BinaryExpression,
          node: binaryExpression,
          operator: "/",
        })
      }
    })

    return this.mutationCombinations
  }

  getMutationCombinations(payload: string): MutationCombination[] {
    // Creating the project
    const project = new morph.Project()
    const source = project.createSourceFile("src/test.ts", payload, { overwrite: true })
    // Compute all the mutation points to further mutation
    const mutationPoints = this.getAllSourceMutationPoints(source)

    return this.createMutantCombinations(mutationPoints)
    // Create mutations without apply in the code itself

    // // TODO: compile the file in the runtime?

    // source.saveSync()
    // const register = tsNode.register({
    //   transpileOnly: true,
    // })
    // const a = register.compile(source.getText(), source.getFilePath())
    // register.reql
    // console.log(a)

    // const dynamicImport = new Function('specifier', 'return import(specifier)');
    // const dynamicallyLoadedEsmModule = await dynamicImport(source.getFilePath());

    // return dynamicallyLoadedEsmModule
  }

  mutate(combination: MutationCombination): any {
    console.log(combination)
  }
}
