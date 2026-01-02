import { describe, it, expect } from 'vitest';
import { Context, Effect, Layer, pipe } from 'effect';

interface Logger {
  readonly log: (msg: string) => Effect.Effect<void>;
}
const Logger = Context.Tag('Logger')<Logger, Logger>();

const logs: string[] = [];
const LoggerTest = Layer.succeed(
  Logger,
  Logger.of({
    log: msg => Effect.sync(() => logs.push(msg)),
  })
);

const program = Effect.gen(function* () {
  const logger = yield* Logger;
  const msg = yield* Effect.succeed('User logged in');
  yield* logger.log(msg);
});

describe('d4', () => {
  it('Logger', () => {
    Effect.runSync(
      Effect.provideService(program, Logger, {
        log: msg => Effect.sync(() => logs.push(msg)),
      })
    );
    expect(logs).toEqual(['User logged in']);
  });
});
