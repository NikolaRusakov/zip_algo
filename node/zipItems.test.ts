import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import {
  insertItemAtOffset,
  processNextInsertion,
  zipItems,
} from "./zipItems.ts";

export const primarySeqGenerator = (n: number) =>
  Array.from({ length: n }, (v, k) => 1000 + k);

// fiddle case #1
// runTest(1, 10, 7, 2, [1000,1001,1002,1003,1004,1005,1006,0,1007,1,1008,2,1009])
// fiddle case #2
// runTest(2, 23, 2, 3, [1000,1001,0,1002,1003,1,1004,1005,2,1006,1007,3,1008,1009,4,1010,1011,5,1012,1013,6,1014,1015,7,1016,1017,8,1018,1019,9,1020,1021,10,1022])
// fiddle case #3
// runTest(3, 5, 4, 6, [1000,1001,1002,1003,0,1004])
// fiddle case #4
// runTest(4, 5, 0, 3, [0,1000,1001,1,1002,1003,2,1004])
// fiddle case #5
// runTest(5, 5, 1, 3, [1000,0,1001,1002,1,1003,1004])
// fiddle case #6
// runTest(6, 50, 3, 7, [1000,1001,1002,0,1003,1004,1005,1006,1007,1008,1,1009,1010,1011,1012,1013,1014,2,1015,1016,1017,1018,1019,1020,3,1021,1022,1023,1024,1025,1026,4,1027,1028,1029,1030,1031,1032,5,1033,1034,1035,1036,1037,1038,6,1039,1040,1041,1042,1043,1044,7,1045,1046,1047,1048,1049])

Deno.test("case #1", function (): void {
  // deno-fmt-ignore
  const expects = [1000, 1001, 1002, 1003, 1004, 1005, 1006, 0, 1007, 1, 1008, 2, 1009]
  const zips = zipItems(
    primarySeqGenerator(10),
    primarySeqGenerator,
    7,
    2,
  );
  assertEquals(zips, expects);
});

Deno.test("case #2", function (): void {
  // deno-fmt-ignore
const expects = [
        1000, 1001, 0, 1002, 1003, 1,
        1004, 1005, 2, 1006, 1007, 3,
        1008, 1009, 4, 1010, 1011, 5,
        1012, 1013, 6, 1014, 1015, 7,
        1016, 1017, 8, 1018, 1019, 9,
        1020, 1021, 10, 1022]
  const zips = zipItems(
    primarySeqGenerator(23),
    primarySeqGenerator,
    2,
    3,
  );
  assertEquals(zips, expects);
});

Deno.test("case #3", function (): void {
  // deno-fmt-ignore
  const expects = [1000, 1001, 1002, 1003, 0, 1004]
  const zips = zipItems(
    primarySeqGenerator(5),
    primarySeqGenerator,
    4,
    6,
  );
  assertEquals(zips, expects);
});

Deno.test("case #4", function (): void {
  // deno-fmt-ignore
  const expects = [0, 1000, 1001, 1, 1002, 1003, 2, 1004]
  const zips = zipItems(
    primarySeqGenerator(5),
    primarySeqGenerator,
    0,
    3,
  );
  assertEquals(zips, expects);
});

Deno.test("case #5", function (): void {
  // deno-fmt-ignore
  const expects = [1000, 0, 1001, 1002, 1, 1003, 1004]
  const zips = zipItems(
    primarySeqGenerator(5),
    primarySeqGenerator,
    1,
    3,
  );
  assertEquals(zips, expects);
});

Deno.test("case #6", function (): void {
  // deno-fmt-ignore
const expects = [
        1000, 1001, 1002, 0,
        1003, 1004, 1005, 1006, 1007, 1008, 1,
        1009, 1010, 1011, 1012, 1013, 1014, 2,
        1015, 1016, 1017, 1018, 1019, 1020, 3,
        1021, 1022, 1023, 1024, 1025, 1026, 4,
        1027, 1028, 1029, 1030, 1031, 1032, 5,
        1033, 1034, 1035, 1036, 1037, 1038, 6,
        1039, 1040, 1041, 1042, 1043, 1044, 7,
        1045, 1046, 1047, 1048, 1049]

  const zips = zipItems(
    primarySeqGenerator(50),
    primarySeqGenerator,
    3,
    7,
  );
  assertEquals(zips, expects);
});

Deno.test("case offset start at end", function (): void {
  // deno-fmt-ignore
  const expects = [1000, 1001, 1002, 1003, 1004]
  const zips = zipItems(
    primarySeqGenerator(5),
    primarySeqGenerator,
    5,
    2,
  );
  assertEquals(zips, expects);
});

Deno.test("case offset out of bounds", function (): void {
  // deno-fmt-ignore
  const expects = [1000, 1001, 1002, 1003, 1004]
  const zips = zipItems(
    primarySeqGenerator(5),
    primarySeqGenerator,
    6,
    2,
  );
  assertEquals(zips, expects);
});

Deno.test("insertItemAtOffset start at the end", function (): void {
  // deno-fmt-ignore
  const expects = [1000, 1001, 1002, 1003, 1004]
  const inserts = insertItemAtOffset({ seqOne: expects, acc: [], next: true })(
    { offset: 5, period: 2 },
  );
  assertEquals(inserts.seqOne, expects);
  assertEquals(inserts.next, false);
});

Deno.test("insertItemAtOffset start at OoB", function (): void {
  // deno-fmt-ignore
  const expects = [1000, 1001, 1002, 1003, 1004]
  const inserts = insertItemAtOffset({ seqOne: expects, acc: [], next: true })(
    { offset: 10, period: 2 },
  );
  assertEquals(inserts.seqOne, expects);
  assertEquals(inserts.next, false);
});

Deno.test("processNextInsertion terminates", function (): void {
  const acc = [1, 4];
  // deno-fmt-ignore
  const seqOne = [1000, 1, 1001, 1002, 4, 1003, 1004]

  const inserts = processNextInsertion({ seqOne: seqOne, acc, next: true })(3);

  assertEquals(inserts.seqOne, seqOne);
  assertEquals(inserts.acc, acc);
  assertEquals(inserts.next, false);
});

Deno.test("processNextInsertion continues", function (): void {
  const acc = [1];
  // deno-fmt-ignore
  const seqOne = [1000, 1, 1001, 1002, 1003, 1004]
  const expectSeqOne = [...seqOne];
  expectSeqOne.splice(4, 0, 4);

  const inserts = processNextInsertion({ seqOne: seqOne, acc, next: true })(3);

  assertEquals(inserts.seqOne, expectSeqOne);
  assertEquals(inserts.acc, [...acc, 4]);
  assertEquals(inserts.next, true);
});
