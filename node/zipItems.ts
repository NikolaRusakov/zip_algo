type SeqTwoAccumulator = { seqOne: number[]; acc: number[]; next: boolean };

const tail = <T>(arr: T[]): T => arr[arr.length - 1];

// Creates secondary items sequence
export const secondaryItemsFactory = (n: number): number[] =>
  Array.from({ length: n }, (_, i) => i);

// Sequence two functor that maps over SeqTwoAccumulator type
const seqTwoFn = (
  { seqOne = [], next = true, acc = [] }: SeqTwoAccumulator,
) => ({
  seqOne: seqOne,
  acc: acc,
  next,
  valueOf: () => ({
    seqOne,
    acc,
    next,
  }),
  fmap: (f: (stf: SeqTwoAccumulator) => SeqTwoAccumulator) =>
    seqTwoFn(f({
      seqOne,
      acc,
      next,
    })),
});

/**
 * Inserts item at given offset
 * forbids at end insertion
 * gracefully handles OoB array insertion error
 * */
export const insertItemAtOffset = ({ acc, seqOne }: SeqTwoAccumulator) =>
  (
    { offset, period }: { period: number; offset: number },
  ): SeqTwoAccumulator => {
    if (offset < seqOne.length) {
      const newSeqOne = [
        ...seqOne.slice(0, offset),
        offset,
        ...seqOne.slice(offset),
      ];
      const newAcc = [...acc, offset];
      const nextInsertionIndex = newSeqOne[tail(newAcc)] + period;
      const notTail = nextInsertionIndex < newSeqOne.length;
      return {
        seqOne: newSeqOne,
        acc: newAcc,
        next: notTail,
      };
    } else {
      return {
        seqOne,
        acc,
        next: false,
      };
    }
  };

/**
 * Gets next insertion index.
 * Compares insert index with sequence one length.
 * If next insertion doesn't exceed last occurrence in first sequence,
 * slice seqOne with insert index at period.
 * Else return args and set next flag to false
 */
export const processNextInsertion = (
  { acc, next, seqOne }: SeqTwoAccumulator,
) =>
  (period: number): SeqTwoAccumulator => {
    const nextInsertionIndex = seqOne[tail(acc)] + period;
    const notTail = nextInsertionIndex < seqOne.length;

    if (notTail) {
      const nextSeqOne = [
        ...seqOne.slice(0, tail(acc) + period),
        nextInsertionIndex,
        ...seqOne.slice(tail(acc) + period),
      ];
      return {
        seqOne: nextSeqOne,
        acc: [...acc, nextInsertionIndex],
        next,
      };
    } else {
      return { acc, next: !next, seqOne };
    }
  };

/**
 * Preprocesses insertion list
 * @returns SeqTwoAccumulator values of seqTwoFn functor
 * */
const preprocessInsertionList = (sequenceOne: number[]) =>
  (period: number) =>
    (offset: number = 2): SeqTwoAccumulator => {
      /**
     * Initializes insertionFn functor with an offset and executes insertion at the offset
     * */
      let insertionFn = seqTwoFn({
        seqOne: sequenceOne,
        acc: [],
        next: true,
      }).fmap((e) => insertItemAtOffset(e)({ period, offset }));

      do {
        // curried because fmap passes functor context and curried function injects period to processNextInsertion fn
        insertionFn = insertionFn.fmap((e) => processNextInsertion(e)(period));
      } while (insertionFn.next === true);
      return insertionFn.valueOf();
    };

/**
 * @description Array with immutably overridden generated item from seq. two at given index
 * @returns number[] Sliced list with overriden sequence item at index given by reduce iterator
 * */
const overrideWithGeneratedItem = (
  acc: number[],
  next: number,
  index: number,
) =>
  (sequenceTwo: number[]): number[] => {
    const seqTwoEl = sequenceTwo[index];
    return [...acc.slice(0, next), seqTwoEl, ...acc.slice(next + 1)];
  };

/**
 * @description preprocesses insertion list based on offset and period,
 * <br/> generates secondary sequence items from factory.
 * <br/> And reduces list of preprocessed sequence one with generated secondary sequence items
 * @returns number[] Overridden insertion list by secondary sequence items
 * */
export const zipItems = (
  primaryItems: number[],
  itemFactory: typeof secondaryItemsFactory,
  offset: number,
  period: number,
): number[] => {
  const sequencer = preprocessInsertionList(primaryItems)(period)(offset);
  const sequenceTwo = secondaryItemsFactory(sequencer.acc.length);

  return sequencer.acc.reduce(
    (args, next, index) =>
      overrideWithGeneratedItem(args, next, index)(sequenceTwo),
    sequencer.seqOne,
  );
};
