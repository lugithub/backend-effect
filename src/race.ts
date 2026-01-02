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
  delay,
  tap,
  race,
  runFork,
} from "effect/Effect";
import { DurationInput, toMillis } from "effect/Duration";

const task1 = succeed("task1").pipe(
  delay("200 millis"),
  tap(Console.log("task1 done")),
  onInterrupt(() => Console.log("task1 interrupted"))
);
const task2 = succeed("task2").pipe(
  delay("100 millis"),
  tap(Console.log("task2 done")),
  onInterrupt(() => Console.log("task2 interrupted"))
);

const program = race(task1)(task2);

export const test = () => runFork(program);
