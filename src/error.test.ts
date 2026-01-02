import { describe, it, expect } from "vitest";
import { die, runSync, catchAllCause, match, matchCause } from "effect/Effect";
import { identity, pipe } from "effect";
import { isDie, isFailType } from "effect/Cause";
import { succeed } from "effect/Exit";

describe("die", () => {
  it("catchAllCause", () => {
    expect(
      runSync(
        pipe(
          die("ooo"),
          catchAllCause((cause) =>
            isFailType(cause)
              ? succeed([3, ["start", "increment", "double"]])
              : succeed([4, ["start", "increment", "double"]])
          )
        )
      )
    ).toStrictEqual([4, ["start", "increment", "double"]]);
  });

  it("matchCause", () => {
    expect(
      runSync(
        pipe(
          die("ooo"),
          matchCause({
            onFailure: (cause) => isDie(cause),
            onSuccess: identity,
          })
        )
      )
    ).toEqual(true);
  });
});
