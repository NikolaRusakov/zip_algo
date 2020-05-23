import {
  runBenchmarks,
  BenchmarkTimer,
  bench,
} from "https://deno.land/std/testing/bench.ts";
import { primarySeqGenerator } from "./zipItems.test.ts";
import { zipItems } from "./zipItems.ts";

bench({
  name: "zip 1000 items with period of 2 at 1 offset",
  runs: 100,
  func(b: BenchmarkTimer): void {
    b.start();
    zipItems(primarySeqGenerator(1000), primarySeqGenerator, 1, 2);
    b.stop();
  },
});

runBenchmarks();
