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
import { some, none } from "effect/Option";

//#region pipe, flow

const increment = (x: number) => x + 1;
const double = (x: number) => x * 2;
const subtractTen = (x: number) => x - 10;

const result = pipe(5, increment, double, subtractTen);

// export const test = () => flow(increment, double, subtractTen, console.log)(5);

//#endregion

//#region map

const addServiceCharge = (amount: number) => amount + 1;

const fetchTransactionAmount = promise(() => Promise.resolve(100));

const finalAmount = pipe(fetchTransactionAmount, map(addServiceCharge));

// const x: (a: Effect<number, never, never>) => Effect<number, never, never> =
//   map(addServiceCharge);
const x = map(addServiceCharge);

// export const test = () =>
//   flow(x, runPromise)(fetchTransactionAmount).then(console.log);
// export const test = () =>
//   runPromise(
//     flow(map(addServiceCharge), map(addServiceCharge))(fetchTransactionAmount)
//   ).then(console.log);

// export const test = () =>
//   pipe(fetchTransactionAmount, map(addServiceCharge), runPromise).then(
//     console.log
//   );

//#endregion

//#region as

// export const test = () =>
//   flow(runSync, console.log)(flow(as("new value"), as(3))(succeed(5)));

//#endregion

//#region flatMap

const applyDiscount = (
  total: number,
  discountRate: number
): Effect<number, Error> =>
  discountRate === 0
    ? fail(new Error("Discount rate cannot be zero"))
    : succeed(total - (total * discountRate) / 100);

// export const test = () =>
//   flow(runPromiseExit)(
//     flow(flatMap((a: number) => applyDiscount(a, 5)))(fetchTransactionAmount)
//   ).then(console.log);

// export const test = () => flow(runSync, console.log)(sync(() => 3));

//#endregion

//#region andThen

const fetchNumberValue = tryPromise(() => Promise.resolve(43));
const validate = (x: number) => (x > 0 ? some(x) : none());
export const test = () => flow(runPromise)(flatMap(validate)(fetchNumberValue));

//#endregion
