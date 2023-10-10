import { Mutator } from "./mutator";
import { sum } from "./fixtures/arithmetic";

const m = new Mutator()
m.mutate(sum.toString()).then((result: any) => {
    console.log(result)
})
