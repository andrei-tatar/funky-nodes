import { SetRange, mergeSortedRanges } from "./range";

export class FunkyNodeSet {

    private items: {
        [key: string]: SetRange[],
    } = {};

    get debug() {
        return JSON.parse(JSON.stringify(this.items));
    }

    static parse(input: string) {
        const set = new FunkyNodeSet();
        const expression = /\b(\w+)\/(\d+)\b/gm;
        let item = expression.exec(input);
        while (item != null) {
            const [, key, valueString] = item;
            const value = parseInt(valueString);
            set.add(key, value);
            item = expression.exec(input);
        }
        return set;
    }

    static merge(a: FunkyNodeSet, b: FunkyNodeSet) {
        const keys = Object.keys(a.items);
        for (const key of Object.keys(b.items)) {
            if (keys.indexOf(key) >= 0) { continue; }
            keys.push(key);
        }
        keys.sort((a, b) => a.localeCompare(b));

        const result = new FunkyNodeSet();
        for (const key of keys) {
            const rangesA = a.items[key];
            const rangesB = b.items[key];
            if (!rangesA || !rangesB) {
                result.items[key] = (rangesA || rangesB).map(r => r.clone());
                continue;
            }

            result.items[key] = mergeSortedRanges(rangesA, rangesB);
        }

        return result;
    }

    private add(key: string, value: number) {
        const ranges = this.items[key];
        const add = new SetRange(value);
        if (!ranges) {
            this.items[key] = [add];
            return;
        }

        for (let index = ranges.length - 1; index >= 0; index--) {
            const range = ranges[index];
            if (range.merge(add)) {
                if (index > 0) {
                    const previousSet = ranges[index - 1];
                    if (range.merge(previousSet)) {
                        ranges.splice(index - 1, 1);
                        return;
                    }
                }
                if (index < ranges.length - 1) {
                    const nextSet = ranges[index + 1];
                    if (range.merge(nextSet)) {
                        ranges.splice(index + 1, 1);
                        return;
                    }
                }
                return;
            }

            if (value > range.end) {
                ranges.splice(index + 1, 0, new SetRange(value));
                return;
            }
        }

        ranges.splice(0, 0, add);
    }

    toString() {
        const items: string[] = [];
        for (const key of Object.keys(this.items)) {
            for (const set of this.items[key]) {
                for (let i = 0; i < set.size; i++) {
                    items.push(`${key}/${i + set.start}`);
                }
            }
        }
        return items.join(', ');
    }

    [Symbol.toPrimitive]() {
        return this.toString();
    }
}
