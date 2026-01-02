import { describe, it, expect } from "vitest";
import { Effect, Console, Exit, flow } from "effect";
import {
  tap,
  andThen,
  runPromise,
  runPromiseExit,
  runSync,
} from "effect/Effect";
import {
  make,
  addFinalizer,
  addFinalizerExit,
  close,
  Scope,
} from "effect/Scope";

describe("scope dummy", () => {
  it("manually make and close a scope", () => {
    // const program = flow(
    //   make,
    //   tap((scope) => addFinalizer(scope, Console.log("finalizer 1"))),
    //   tap((scope) => addFinalizer(scope, Console.log("finalizer 2"))),
    //   tap((scope) => close(scope, Exit.succeed("scope closed successfully")))
    // );

    const program = flow(
      make,
      tap((scope) =>
        addFinalizerExit(scope, (exit) => Console.log("finalizer 1", exit))
      ),
      tap((scope) =>
        addFinalizerExit(scope, (exit) => Console.log("finalizer 2", exit))
      ),
      andThen(
        (scope) => close(scope, Exit.succeed("scope closed successfully")) // a return of Effect is required.
      )
    );

    return runPromise(program()).then(() => expect(0).toEqual(0));
  });

  it.only("automatically", () => {
    const program = flow(
      Effect.addFinalizer,
      andThen(
        Effect.addFinalizer((exit) =>
          Console.log(`Finalizer 2 executed. Exit status: ${exit._tag}`)
        )
      ),
      andThen(Effect.fail("some result"))
    )((exit) => Console.log(`Finalizer 1 executed. Exit status: ${exit._tag}`));

    const runnable = Effect.scoped(program);

    return runPromiseExit(runnable).then(() => expect(0).toEqual(0));
  });
});

/*
Output:
finalizer 2 <-- finalizers are closed in reverse order
finalizer 1
*/
