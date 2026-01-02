import { pipe, flow } from "effect";
import {
  as,
  fail,
  flatMap,
  map,
  promise,
  runSync,
  runPromise,
  runPromiseExit,
  succeed,
  sync,
  tryPromise,
  Effect,
} from "effect/Effect";

type Writer<W, A> = Effect<[A, W], never, never>;

// A simple monoid for logs (array of strings)
const logMonoid = {
  empty: [] as string[],
  concat: (x: string[], y: string[]) => [...x, ...y],
};

// Helper to create a Writer
const writer = <A>(a: A, log: string[]): Writer<string[], A> =>
  succeed([a, log]);

const chain =
  <A, B>(f: (a: A) => Writer<string[], B>) =>
  (fa: Writer<string[], A>): Writer<string[], B> =>
    pipe(
      fa,
      flatMap(([a, log1]) =>
        pipe(
          f(a),
          map(([b, log2]) => [b, logMonoid.concat(log1, log2)])
        )
      )
    );

const program = pipe(
  writer(1, ["start"]),
  chain((x) => writer(x + 1, ["increment"])),
  chain((x) => writer(x * 2, ["double"]))
);

export const test = () => runSync(program);
