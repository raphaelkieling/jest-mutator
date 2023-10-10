export function sum(a: number, b: number): number {
  return a + b;
}

export function divideWithVariables(a: number, b: number): number {
  const result = a / b
  return result
}

let globalVar = 0
export function divideGlobalStatic(a: number, b: number): number {
  globalVar = a / b
  return globalVar
}

export function divide(a: number, b: number): number {
  return a / b;
}

export class Calculate {
  a: number = 0

  sum(a: number, b: number): number {
    return a + b;
  }

  div(a: number, b: number): number {
    this.a = a
    return this.a / b;
  }
}
