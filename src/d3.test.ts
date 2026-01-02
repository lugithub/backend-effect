import { describe, it, expect } from 'vitest';
import { Context, Effect, pipe } from 'effect';

// 1. Define the interface
interface Database {
  readonly save: (data: string) => Effect.Effect<undefined, string>;
}

// 2. Create the Tag (the unique identifier for the service)
const Database = Context.Tag('MyDatabase')<Database, Database>();

const dbService: Database = {
  save: (data: string) =>
    data === '' ? Effect.fail('Empty data') : Effect.succeed(void 0),
};

// 3. Use the service inside an Effect
const program = pipe(
  Database, // This "pulls" the service from the environment
  Effect.flatMap(db => db.save('User Data'))
);

const runnalbe = Effect.provideService(program, Database, dbService);

const program2 = pipe(
  Database, // This "pulls" the service from the environment
  Effect.flatMap(db => db.save('')),
  Effect.catchAll(err => Effect.succeed(err))
);

const runnalbe2 = Effect.provideService(program2, Database, dbService);

describe('d3', () => {
  it('Database', () => {
    expect(Effect.runSync(runnalbe)).toEqual(void 0);
  });

  it('Database fail', () => {
    expect(Effect.runSync(runnalbe2)).toEqual('Empty data');
  });

  it('Logger', () => {
    Effect.runSync(
      Effect.provideService(myAction, Logger, {
        log: msg => Effect.succeed(console.log(msg)),
      })
    );
  });
});

interface Logger {
  readonly log: (msg: string) => Effect.Effect<void>;
}
const Logger = Context.Tag('Logger')<Logger, Logger>();

const myAction = pipe(
  Logger,
  Effect.flatMap(logger => logger.log('User logged in'))
);
