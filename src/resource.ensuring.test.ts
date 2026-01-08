import { describe, it, expect } from 'vitest';
import { Console, Effect, Exit, identity, pipe, Random } from 'effect';

describe('ensuring', () => {
  it('after success', () => {
    Effect.runSync(success);
    const x = Exit.getOrElse(Effect.runSyncExit(success), identity);
  });

  it('after failure', () => {
    const x = Exit.getOrElse(Effect.runSyncExit(failure), identity);
    console.log(x);
  });

  it('success or failure', () => {
    Effect.runSyncExit(tr);
  });
});

const tr = pipe(
  Effect.if(Random.nextBoolean, {
    onFalse: () => failure,
    onTrue: () => success,
  }),
  Effect.ensuring(Console.log('Cleanup completed 1'))
);

const success = pipe(
  Console.log('Task completed'),
  Effect.as('some result')
  // Effect.ensuring(Console.log('Cleanup completed'))
);

const failure = pipe(
  Console.log('Task failed'),
  Effect.andThen(Effect.fail('some error'))
  // Effect.ensuring(Console.log('Cleanup completed'))
);
