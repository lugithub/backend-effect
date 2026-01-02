import { describe, it, expect } from "vitest";
import { test } from "./writer";

describe("writer", () => {
  it("test", () => {
    expect(test()).toStrictEqual([4, ["start", "increment", "double"]]);
  });
});
