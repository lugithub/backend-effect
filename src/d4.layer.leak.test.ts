import { describe, it, expect } from 'vitest';
import { Context, Effect, Layer, pipe } from 'effect';

class Config extends Context.Tag('Config')<Config, {}>() {}

class Logger extends Context.Tag('Logger')<Logger, {}>() {}

class Database extends Context.Tag('Database')<
  Database,
  {
    readonly query: (
      sql: string
    ) => Effect.Effect<string[], never, Config | Logger>;
  }
>() {}

const DatabaseTest = Database.of({
  query: (sql: string) => Effect.succeed([sql]),
});

const test = Effect.gen(function* () {
  const database = yield* Database;
  const result = yield* database.query('SELECT * FROM users');
  return result;
  // assert.deepStrictEqual(result, []);
});

//      ┌─── Effect<string[], never, Config | Logger>
//      ▼
const incompleteTestSetup = test
  .pipe(Effect.provideService(Database, DatabaseTest))
  .pipe(Effect.provideService(Config, Config.of({})))
  .pipe(Effect.provideService(Logger, Logger.of({})));

describe('d4', () => {
  it('Layer leak', () => {
    expect(JSON.stringify(Effect.runSync(incompleteTestSetup))).toBe(
      JSON.stringify(['SELECT * FROM users'])
    );
  });
});
