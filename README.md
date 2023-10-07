## Jest Mutator

> Project inspired on [Stryker Mutator](https://stryker-mutator.io/) but more focused and simpler for easy adoption.

It mutates in a simple way to try to catch simple bugs inside the statements. It should be used inside the `describe` block to mutate all the possible scenarios within the scope of this describe.

Why? To democratize mutation tests. Today, you need to run some mutators for hours and also allocate some time to understand and integrate them into your pipeline. Here, it's easy. Just use .mutate and gain all the advantages.

Design idea:
- be able to use a simple `.mutate` with all the reference function to mutate using the typescript's AST
- integrate Jest coverage report
- generate simple report to check the remaining mutates that werent covered or killed

```ts
describe.mutate([sum])('my sum func', () =>{
    it('should return x', () => {
        const result = sum(1, 1)
        expect(result).toBe(2)
    })
})
```
