import { describe, it, expect } from 'vitest';
import { Effect, pipe } from 'effect';
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
  Effect as IEffect,
} from 'effect/Effect';

const checkLength = (pass: string): IEffect<string, string > =>
  pass.length > 5 ? succeed(pass) : fail('TooShort');

const validate = (pass: string) =>
  pipe(
    checkLength(pass),
    Effect.catchAll(e =>
      e === 'TooShort' ? succeed(`IPassword is weak but okay`) : fail(e)
    )
  );

describe('d2', () => {
  it('pipe', () => {
    expect(runSync(validate('12345'))).toEqual('IPassword is weak but okay');
  });
});
