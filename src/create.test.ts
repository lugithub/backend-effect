import { describe, it, expect } from 'vitest';
import { pipe } from 'effect';
import {
  succeed,
  fail,
  sync,
  runSync,
  runSyncExit,
  runPromise,
  runPromiseExit,
  try as try_,
  promise,
  tryPromise,
} from 'effect/Effect';
import { map, match } from 'effect/Exit';
import { Cause, Fail, UnknownException } from 'effect/Cause';
import { FiberFailure } from 'effect/Runtime';

describe('create', () => {
  it('succeed', () => {
    expect(runSync(succeed(42))).toEqual(42);
  });

  it('sync', () => {
    expect(runSync(sync(() => 42))).toEqual(42);
  });

  ///Users/totoro/lc/backend-effect/node_modules/effect/src/Exit.ts
  it('succeed runSyncExit match', () => {
    match<never, number, never, void>({
      onFailure: () => {
        throw 'onSuccess should not be called';
      },

      onSuccess: a => {
        expect(a).toEqual(42);
      },
    })(runSyncExit(succeed(42)));
  });
  // it("succeed runSyncExit match", () => {
  //   match<number, never, never, void>(runSyncExit(succeed(42)), {
  //     onFailure: () => {
  //       throw "onSuccess should not be called";
  //     },

  //     onSuccess: (a) => {
  //       expect(a).toEqual(42);
  //     },
  //   });
  // });

  it('fail runSyncExit match', () => {
    match<number, never, void, never>({
      onFailure: cause =>
        'error' in cause
          ? expect(cause.error).toEqual(42)
          : (() => {
              throw 'cause should have error';
            })(),

      onSuccess: () => {
        throw 'onSuccess should not be called';
      },
    })(runSyncExit(fail(42)));
  });
  // it("fail runSyncExit match", () => {
  //   pipe(
  //     runSyncExit(fail(42)),
  //     match({
  //       onFailure: (cause) =>
  //         "error" in cause
  //           ? expect(cause.error).toEqual(42)
  //           : (() => {
  //               throw "cause should have error";
  //             })(),

  //       onSuccess: () => {
  //         throw "onSuccess should not be called";
  //       },
  //     })
  //   );
  // });

  it('try Failure', () => {
    match<number, any, void, never>({
      // onFailure: (cause: Cause<UnknownException>) =>
      //   "error" in cause
      //     ? expect(cause.error.message).toMatch(/An unknown error occurred/)
      //     : (() => {
      //         throw "cause should have error";
      //       })(),
      onFailure: (cause: Cause<number>) =>
        'error' in cause
          ? expect(cause.error).toEqual(7)
          : (() => {
              throw 'cause should have error';
            })(),

      onSuccess: () => {
        throw 'onSuccess should not be called';
      },
    })(runSyncExit(program));
  });

  it('try Success', () => {
    match<number, { a: number }, never, void>({
      onFailure: () => {
        throw 'onFailure should not be called';
      },

      onSuccess: b => expect(b).toEqual({ a: 1 }),
    })(runSyncExit(program2));
  });

  it('promise resolve', () => {
    return runPromise(promise(() => Promise.resolve(3))).then(a =>
      expect(a).toEqual(3)
    );
  });

  it('promise reject', () => {
    return runPromise(promise(() => Promise.reject(3)))
      .then(() => {
        throw 'then should not be called';
      })
      .catch(a => expect(a.toString()).toEqual('(FiberFailure) Error: 3'));
  });

  it('trypromise reject', () => {
    return runPromiseExit(
      tryPromise({
        try: () => Promise.reject(3),
        catch: e => {
          return { a: 4 };
        },
      })
    )
      .then(a => {
        match({
          onFailure: (e: Cause<{ a: number }>) => {
            'error' in e
              ? expect(e.error).toEqual({ a: 4 })
              : (() => {
                  throw 'missing error ';
                })();
          },
          onSuccess: () => {
            throw 'onSuccess should not be called';
          },
        })(a);
        // a.pipe((_, e) => console.log(e));
        // throw "then should not be called";
      })
      .catch(e => {
        console.log(e);
        throw 'catch should not be called';
      });
  });
});

const parse = <T>(input: string) =>
  // This might throw an error if input is not valid JSON
  try_({ try: () => JSON.parse(input) as T, catch: e => 7 });
// try_(() => JSON.parse(input));

//      ┌─── Effect<any, UnknownException, never>
//      ▼
const program = parse<{ name: string }>('');
const program2 = parse<{ a: number }>('{"a":1}');
