import { describe, it, expect } from 'vitest';
import { Context, Effect, Layer, pipe } from 'effect';

// Declaring a tag for the Config service
class Config extends Context.Tag('Config')<
  Config,
  {
    readonly getConfig: Effect.Effect<{
      readonly logLevel: string;
      readonly connection: string;
    }>;
  }
>() {}

// Layer<Config, never, never>
const ConfigLive = Layer.succeed(
  Config,
  Config.of({
    getConfig: Effect.succeed({
      logLevel: 'INFO',
      connection: 'mysql://username:password@hostname:port/database_name',
    }),
  })
);

// Declaring a tag for the Logger service
class Logger extends Context.Tag('Logger')<
  Logger,
  { readonly log: (message: string) => Effect.Effect<void> }
>() {}

// Layer<Logger, never, Config>
const LoggerLive = Layer.effect(
  Logger,
  Effect.gen(function* () {
    const config = yield* Config;
    return {
      log: message =>
        Effect.gen(function* () {
          const { logLevel } = yield* config.getConfig;
          console.log(`[${logLevel}] ${message}`);
        }),
    };
  })
);

// Declaring a tag for the Database service
class Database extends Context.Tag('Database')<
  Database,
  { readonly query: (sql: string) => Effect.Effect<{ result: string }> }
>() {}

// Layer<Database, never, Config | Logger>
const DatabaseLive = Layer.effect(
  Database,
  Effect.gen(function* () {
    const config = yield* Config;
    const logger = yield* Logger;
    return {
      query: (sql: string) =>
        Effect.gen(function* () {
          yield* logger.log(`Executing query: ${sql}`);
          const { connection } = yield* config.getConfig;
          return { result: `Results from ${connection}` };
        }),
    };
  })
);

const AppConfigLive = Layer.merge(ConfigLive, LoggerLive);

const MainLive = pipe(
  DatabaseLive,
  Layer.provide(AppConfigLive),
  Layer.provide(ConfigLive)
);

const test = Effect.gen(function* () {
  const database = yield* Database;
  const result = yield* database.query('SELECT * FROM users');
  return result;
  // assert.deepStrictEqual(result, []);
});
//      ┌─── Effect<{ result: string }, never, never>
//      ▼
const completeTestSetup = Effect.provide(test, MainLive);

const DatabaseTest = Layer.effect(
  Database,
  Effect.gen(function* () {
    return {
      query: (sql: string) =>
        Effect.gen(function* () {
          return {
            result: `Results from mysql://username:password@hostname:port/database_name`,
          };
        }),
    };
  })
);

const testSetup = Effect.provide(test, DatabaseTest);

describe('d4', () => {
  it('MainLive', () => {
    expect(JSON.stringify(Effect.runSync(completeTestSetup))).toBe(
      JSON.stringify({
        result:
          'Results from mysql://username:password@hostname:port/database_name',
      })
    );
  });

  it('MainLive runPromise', () => {
    return Effect.runPromise(completeTestSetup).then(r =>
      expect(r).toEqual({
        result:
          'Results from mysql://username:password@hostname:port/database_name',
      })
    );
  });

  it('DatabaseTest', () => {
    expect(JSON.stringify(Effect.runSync(testSetup))).toBe(
      JSON.stringify({
        result:
          'Results from mysql://username:password@hostname:port/database_name',
      })
    );
  });
});
