import * as typescript from 'typescript'


function mutate(file: string) {
    console.log("mutating...")
    const ast = typescript
        .createProgram([file], {})
        .getSourceFile(file)

    ast?.forEachChild((node) => {
        if (typescript.isFunctionDeclaration(node)) {
            console.log('name: ',node.name?.text)
            node.body?.forEachChild((child) => {
                if (typescript.isReturnStatement(child)) {
                    console.log('return: ', child.expression)
                }
            })
        }
    })
}


mutate('./example/calc.ts')
