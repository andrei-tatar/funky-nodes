import { FunkyNodeSet } from './funkyset';

const setA = FunkyNodeSet.parse('a/1, a/2, a/3, a/4, a/128, a/129, b/65, b/66, c/1, c/10, c/42');
const setB = FunkyNodeSet.parse('a/1, a/2, a/3, a/4 a/5, a/126, a/127, b/100, c/2, c/3, d/1');
const merged = FunkyNodeSet.merge(setA, setB);

console.log(`${setA}\n+\n${setB}\n=\n${merged}`);
console.log('debug:\n', merged.debug);
