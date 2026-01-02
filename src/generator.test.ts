import { describe, it, expect, vi } from "vitest";
import { test } from "./pipeline";
import { Effect, Console } from "effect";

const task1 = Console.log("task1...");
const task2 = Console.log("task2...");

const program = Effect.gen(function* () {
  // Perform some tasks
  yield* task1;
  yield* task2;

  // Introduce an error
  yield* Effect.fail("Something went wrong!");
});

/*
Output:
task1...
task2...
(FiberFailure) Error: Something went wrong!
*/

describe("gen", () => {
  it("raise error", () => {
    const handleError = vi.fn();
    return Effect.runPromise(program)
      .then(console.log)
      .catch(handleError)
      .then(() => expect(handleError).toHaveBeenCalled());
    // .catch()
  });
});
