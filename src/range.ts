export class SetRange {
    get end() {
        return this.start + this.size - 1;
    }

    constructor(
        public start: number,
        public size = 1,
    ) {
    }

    canMerge(set: SetRange) {
        if (Math.min(this.end, set.end) - Math.max(this.start, set.start) >= -1) {
            return true;
        }
        return false;
    }

    merge(set: SetRange) {
        if (this.canMerge(set)) {
            this.expand(set);
            return true;
        }
        return false;
    }

    expand(set: SetRange) {
        const newStart = Math.min(this.start, set.start);
        const newSize = Math.max(this.end, set.end) - newStart + 1;
        this.start = newStart;
        this.size = newSize;
        return this;
    }

    clone() {
        return new SetRange(this.start, this.size);
    }
}

function pushOrMergeRange(merged: SetRange[], range: SetRange, checkMergeLast = false) {
    if (checkMergeLast) {
        const last = merged[merged.length - 1];
        if (last && last.merge(range)) {
            return true;
        }
    }

    merged.push(range);
    return false;
}

export function mergeSortedRanges(rangesA: SetRange[], rangesB: SetRange[]) {
    const merged: SetRange[] = [];

    let indexA = 0, indexB = 0;
    while (indexA < rangesA.length && indexB < rangesB.length) {
        const rangeA = rangesA[indexA]
        const rangeB = rangesB[indexB];

        if (rangeA.canMerge(rangeB)) {
            const mergedRange = rangeA.clone().expand(rangeB);
            pushOrMergeRange(merged, mergedRange, true);
            indexA++;
            indexB++;
        } else if (rangeA.start < rangeB.start) {
            pushOrMergeRange(merged, rangeA.clone());
            indexA++;
        } else {
            pushOrMergeRange(merged, rangeB.clone());
            indexB++;
        }
    }

    let checkLast = true;
    while (indexA < rangesA.length) {
        checkLast = pushOrMergeRange(merged, rangesA[indexA++], checkLast);
    }
    while (indexB < rangesB.length) {
        checkLast = pushOrMergeRange(merged, rangesB[indexB++], checkLast);
    }
    return merged;
}