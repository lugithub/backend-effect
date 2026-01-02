import { describe, it, expect } from "vitest";
import { of, map, chain, State, test, test2, test3 } from "./state";

describe("State", () => {
  it("of", () => {
    const state = of<{ name: string }, number>(0); // lift 0 to State Monard
    expect(state({ name: "foo" })).toStrictEqual([0, { name: "foo" }]);
  });

  it("map", () => {
    const state = map<{ name: string }, string, number>(
      (a: string) => a.length
    )(of<{ name: string }, string>("abc")); // State is functor
    expect(state({ name: "foo" })).toStrictEqual([3, { name: "foo" }]);
  });

  it("chain", () => {
    const f =
      (a: string): State<{ name: string }, number> =>
      (s: { name: string }) =>
        [a.length, { name: `${s.name}/${a}` }];

    const state = chain<{ name: string }, string, number>(f)(
      of<{ name: string }, string>("abc")
    );

    expect(state({ name: "foo" })).toStrictEqual([3, { name: "foo/abc" }]);
  });

  it("test", () => {
    expect(test()).toStrictEqual([1, 2]);
  });

  it("test2", () => {
    expect(test2()).toStrictEqual([1, 2]);
  });

  it("test3", () => {
    expect(test3()).toStrictEqual([1, 3]);
  });
});
