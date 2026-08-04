import { describe, expect, it } from "vitest";
import { circMaskURI, clamp01 } from "./circMask";

describe("circMaskURI", () => {
  it("returns null for empty text", () => {
    expect(circMaskURI("")).toBeNull();
    expect(circMaskURI("   ")).toBeNull();
    expect(circMaskURI(null)).toBeNull();
  });

  it("returns a data URI for non-empty text", () => {
    const uri = circMaskURI("SECURE");
    expect(uri).toMatch(/^data:image\/svg\+xml,/);
    expect(decodeURIComponent(uri!)).toContain("SECURE");
  });
});

describe("clamp01", () => {
  it("clamps to 0..1", () => {
    expect(clamp01(-1)).toBe(0);
    expect(clamp01(0.5)).toBe(0.5);
    expect(clamp01(2)).toBe(1);
  });
});
