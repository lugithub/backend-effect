import { describe, it, expect } from "vitest";
import { Console, Schedule } from "effect";
import { runPromise, repeat, sync, as } from "effect/Effect";
import { recurs, addDelay } from "effect/Schedule";
describe("repeat dummmy", () => {
  it("pass", () => {
    console.time("foo");
    return runPromise(program).then(() => expect(0).toEqual(0));
  });
});

const action = Console.log("success").pipe(
  as(sync(() => console.timeLog("foo")))
);

const policy = addDelay(recurs(2), (out) => {
  console.log("out", out);
  return "3000 millis";
});
// const policy = recurs(2);

const program = repeat(policy)(action);
