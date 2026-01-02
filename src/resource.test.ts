import { describe, it, expect } from "vitest";
import { Console, Effect, Exit, identity } from "effect";
import { promise, succeed, fail, die } from "effect/Effect";
import { isSuccess } from "effect/Exit";
import { isDie, isFailure, isEmpty, isEmptyType } from "effect/Cause";

describe("dummmy", () => {
  it("pass", () => {
    return expect(0).toEqual(0);
  });
});

//#region FiberFailure ensuring
// const handler = Effect.ensuring(Console.log("Cleanup completed"));
// const success = promise(() => Promise.reject("")).pipe(
//   Effect.as(Console.log("aaa")),
//   Effect.as("some result"),
//   handler
// );
// Effect.runPromise(success);
//#endregion

//#region isEmpty
const handler1 = Effect.onExit((exit) =>
  Console.log(`Cleanup completed: ${isSuccess(exit)}`)
);
const success1 = succeed({ code: "Task" }).pipe(
  Effect.as("some result"),
  handler1
);
Effect.runSyncExit(success1);
//#endregion

//#region isFailure
// const handler1 = Effect.onExit((exit) =>
//   Console.log(
//     `Cleanup completed: ${Exit.getOrElse((cause) =>
//       console.log(isFailure(cause))
//     )(exit)}`
//   )
// );
// const success1 = fail({ code: "Task failed" }).pipe(
//   Effect.as("some result"),
//   handler1
// );
// Effect.runFork(success1);
//#endregion

//#region isDie
// const handler1 = Effect.onExit((exit) =>
//   Console.log(
//     `Cleanup completed: ${Exit.getOrElse((cause) => console.log(isDie(cause)))(
//       exit
//     )}`
//   )
// );
// const success1 = die({ code: "Task died" }).pipe(
//   Effect.as("some result"),
//   handler1
// );
// Effect.runFork(success1);
//#endregion
