import { Console, pipe, flow } from "effect";
import {
  Effect,
  all,
  interrupt,
  sleep,
  succeed,
  fail,
  gen,
  promise,
  runPromise,
  runPromiseExit,
  withConcurrency,
  onInterrupt,
  forEach,
} from "effect/Effect";
import { DurationInput, toMillis } from "effect/Duration";

// const divide = (a: number, b: number): Effect<number, Error, number> =>
//   b === 0 ? fail(new Error("Cannot divide by zero")) : succeed(a / b);

// pipe(divide(1, 3), console.log);

const makeTask = (n: number, delay: DurationInput) =>
  promise(
    (a) =>
      new Promise<void>((resolve) => {
        console.log(`start task${n}`);
        setTimeout(() => {
          console.log(`task${n} done`);
          resolve();
        }, toMillis(delay));
      })
  );

const task1 = makeTask(1, "10000 millis");
const task2 = makeTask(2, "10000 millis");
const task3 = makeTask(3, "10000 millis");
const task4 = makeTask(4, "10000 millis");
const task5 = makeTask(5, "10000 millis");

const sequential = all([task1, task2]);
const numbered = all([task1, task2, task3, task4, task5], {
  concurrency: 2,
});
const unbounded = all([task1, task2, task3, task4, task5], {
  concurrency: "unbounded",
});
const inherit = all([task1, task2, task3, task4, task5], {
  concurrency: "inherit",
}).pipe(withConcurrency(2));

// runPromise(sequential);
// runPromise(numbered);
// runPromise(unbounded);
// runPromise(inherit);

// const handler = onInterrupt((_fibers) => Console.log("Cleanup completed"));
// const program = gen(function* () {
//   console.log("start");
//   yield* sleep("2 seconds");

//   yield* interrupt;

//   console.log("done");
//   return "some result";
// }).pipe(handler);

const program = forEach(
  [1, 2, 3],
  (n) =>
    gen(function* () {
      console.log(`start #${n}`);
      yield* sleep(`${n} seconds`);

      if (n > 1) {
        yield* interrupt;
      }

      console.log(`done #${n}`);
    }).pipe(onInterrupt(() => Console.log(`interrupted #${n}`))),
  { concurrency: "unbounded" }
).pipe(onInterrupt(() => Console.log(`interrupted all`)));

export const test = () =>
  runPromiseExit(program).then(
    flow((exit) => JSON.stringify(exit, null, 2), console.log)
  );
