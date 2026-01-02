import { describe, it, expect } from "vitest";
import { Console, Effect, Exit, identity, flow, LogLevel, pipe } from "effect";
import {
  promise,
  succeed,
  fail,
  log,
  runFork,
  runPromiseExit,
  runPromise,
  withLogSpan,
  as,
  sleep,
  gen,
  logDebug,
} from "effect/Effect";
import { die } from "effect/Cause";
import { withMinimumLogLevel } from "effect/Logger";

describe("log dummmy", () => {
  it("pass", () => {
    return runPromise(program).then(() => expect(0).toEqual(0));
  });
});

// runFork(
//   flow(
//     log,
//     as(
//       gen(function* () {
//         yield* sleep("3 seconds");
//         yield* log("The job is finished!");
//       })
//     ),
//     withLogSpan("myspan")
//   )("hello world")
// );
// runFork(
//   flow(
//     () =>
//       gen(function* () {
//         yield* sleep("4 seconds");
//         yield* log("The job is finished!");
//       }),
//     withLogSpan("myspan")
//   )()
// );

// const program = log("message1", "message2", die("Oh no!"), die("Oh uh!"));

// const program = pipe(logDebug("aaa"), withMinimumLogLevel(LogLevel.Debug));

const program = gen(function* () {
  yield* sleep("3 seconds");

  yield* log("The job is finished!");
}).pipe(withLogSpan("myspnan"));
