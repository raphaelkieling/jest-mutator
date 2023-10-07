WIP: Jest Mumator

It mutates in a simple way to try catch simple bugs inside the statements, it should be used inside the describe to mutate all the possible scenarios inside the scope of this describe.


Why? Democratize the mutation tests, today you need to run for hours some mutators and also request some time to understand and integrate in you pipeline. Here, is easy, use `.mutate` and get the all the advantage.

```ts
describe.mutate([sum])('my sum func', () =>{
    it('should return x', () => {
        const result = sum(1, 1)
        expect(result).toBe(2)
    })
})
```
