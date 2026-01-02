import { pipe, flow } from "effect"; // effect is a module
import {
  as,
  fail,
  flatMap,
  promise,
  runSync,
  runPromise,
  runPromiseExit,
  succeed,
  sync,
  tryPromise,
  Effect, // Effect is an interface
} from "effect/Effect"; // effect/Effect is a module

export type State<S, A> = (state: S) => [A, S];

export const of =
  <S, A>(a: A): State<S, A> =>
  (s) =>
    [a, s];

export const map =
  <S, A, B>(f: (a: A) => B) =>
  (fa: State<S, A>): State<S, B> =>
  (s) => {
    const [a, newState] = fa(s);
    return [f(a), newState];
  };

export const chain =
  <S, A, B>(f: (a: A) => State<S, B>) =>
  (fa: State<S, A>): State<S, B> =>
  (s) => {
    const [a, newState] = fa(s);
    return f(a)(newState);
  };

const get =
  <S>(): State<S, S> =>
  (s) =>
    [s, s];

const put =
  <S>(newState: S): State<S, void> =>
  () =>
    [undefined, newState];

// A stateful computation that increments the state and returns old value
const increment: State<number, number> = (s) => [s, s + 1];

// export const test = flatMap((v1: number) =>
//   flatMap((v2: number) => of<number, number>(v1 + v2))(increment)
// )(increment);

export const test = () =>
  pipe(
    increment,
    chain((b: number) =>
      chain((a: number) => of<number, number>(a + b))(increment)
    )
  )(0);
// const [result, finalState] = test(0)
// console.log(result)      // 1 (0 + 1)
// console.log(finalState)  // 2

export const test2 = () =>
  pipe(
    increment,
    chain((_) => increment)
  )(0);

export const test3 = () =>
  pipe(
    of<number, number>(1),
    chain((a) => (s) => [a, a + s]),
    chain((a) => (s) => [a, a + s]),
    chain((a) => (s) => [a, a + s])
  )(0);
