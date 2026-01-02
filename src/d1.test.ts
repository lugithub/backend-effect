import { describe, it, expect } from 'vitest';
import { pipe } from 'effect';
import {
  succeed,
  fail,
  map,
  sync,
  runSync,
  runSyncExit,
  runPromise,
  runPromiseExit,
  try as try_,
  promise,
  tryPromise,
  Effect,
} from 'effect/Effect';
import { match } from 'effect/Exit';
import { Cause, Fail, UnknownException } from 'effect/Cause';
import { FiberFailure } from 'effect/Runtime';

const parseNumber = (s: string): Effect<number, string> =>
  isNaN(Number(s)) ? fail('Not a number') : succeed(Number(s));

const result = pipe(
  parseNumber('10'),
  map(n => n * 2)
);

describe('d1', () => {
  it('pipe', () => {
    expect(runSync(result)).toEqual(20);
  });
});
