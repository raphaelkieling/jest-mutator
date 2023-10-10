import * as morph from "ts-morph";
import { randomUUID } from "node:crypto";
import logger from "./logger";

interface MutationCombination {
  type: morph.SyntaxKind;
  source: morph.SourceFile;
  node: morph.Node;
  execute: () => void;
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
  private createMutantCombinations(source: morph.SourceFile, nodes: morph.Node[]): any[] {
    nodes.forEach((node) => {
      if(node.getKind() === morph.SyntaxKind.BinaryExpression) {
        const binaryExpression = node as morph.BinaryExpression

        this.mutationCombinations.push({
          type: morph.SyntaxKind.BinaryExpression,
          source,
          node,
          execute: () => {
            binaryExpression.getOperatorToken().replaceWithText("*")
          }
        })

        this.mutationCombinations.push({
          type: morph.SyntaxKind.BinaryExpression,
          source,
          node,
          execute: () => {
            binaryExpression.getOperatorToken().replaceWithText("/")
          }
        })
      }
    })

    return this.mutationCombinations
  }

  getMutationCombinations(payload: string): MutationCombination[] {
    // Creating the project
    const project = new morph.Project({
      compilerOptions:{
        allowJs: true,
        noEmitOnError: true,
        strictNullChecks: true,
        strictFunctionTypes: true,
        strictBindCallApply: true,
        strictPropertyInitialization: true,
        moduleResolution: morph.ModuleResolutionKind.Classic,
        target: morph.ScriptTarget.ES5,
        sourceMap: true,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        inlineSources: true,
       }
    })
    const source = project.createSourceFile(`${randomUUID()}.ts`, payload, { scriptKind: morph.ScriptKind.JS  })

    // Compute all the mutation points to further mutation
    const mutationPoints = this.getAllSourceMutationPoints(source)

    // Create mutations without apply in the code itself
    return this.createMutantCombinations(source, mutationPoints)
  }

  mutateFunction(combination: MutationCombination, fn: string): string {
    logger.debug("mutating combination", combination.type)
    combination.execute()

    const node = combination
      .source
      .getChildrenOfKind(morph.SyntaxKind.FunctionDeclaration)
      .find((node)=> node.getName() === fn)

    if(node === undefined) throw new Error("Function not found")

    // if(node.isDefaultExport()) {
    //   node.setIsDefaultExport(false);
    //   node.setIsExported(true);
    // }

    // if(node.isExported()) {
    //   node.setIsDefaultExport(true);
    //   node.setIsExported(false);
    // }

    return node.getText()
  }
}
