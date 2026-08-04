import type { BadgePreset, BadgeOptics, BadgeContent } from "../types/badge";
import p1 from "../assets/patterns/p1.png";
import p2 from "../assets/patterns/p2.png";
import p3 from "../assets/patterns/p3.png";
import p4 from "../assets/patterns/p4.png";

export const PATTERN_ASSETS = {
  p1,
  p2,
  p3,
  p4,
} as const;

export const BADGE_PRESETS: readonly BadgePreset[] = [
  {
    id: "radial-seal",
    name: "Radial Seal",
    substrate: "silver",
    pattern: "p1",
    rationale:
      "A centred guilloché mandala under a broad, slow diffraction — reads as a formal wax-seal stand-in.",
  },
  {
    id: "embossed-artifact",
    name: "Embossed Artifact",
    substrate: "silver",
    pattern: "p3",
    rationale:
      "Ornate engraving whose holo colour surfaces on the lines with tight specular falloff for raised relief.",
  },
  {
    id: "prismatic-coin",
    name: "Prismatic Coin",
    substrate: "silver",
    pattern: "p2",
    rationale:
      "An aperture swirl — a minted, coin-like artifact with contained prismatic shift on the engraving.",
  },
  {
    id: "dark-iridescent",
    name: "Concentric Iridescent",
    substrate: "silver",
    pattern: "p4",
    rationale:
      "Concentric waves whose restrained iridescence surfaces on the lines only where the light lands.",
  },
] as const;

export const DEFAULT_CONTENT: Required<BadgeContent> = {
  verified: "VERIFIED",
  brand: "NEWTON",
  customer: "BIZANTINE",
  protocol: "AUTHORIZATION LAYER\nSEAL",
  serial: "N° 000241",
  circular: "SECURE · GENUINE · VALID · AUTHENTIC",
};

export const DEFAULT_OPTICS: Required<BadgeOptics> = {
  intensity: 0.7,
  saturation: 1,
  refl: 150,
  density: 0.5,
  patOpacity: 0.55,
  tilt: 7,
};

export const NEUTRAL_LIGHT = {
  px: 0.5,
  py: 0.4,
  la: 110,
  rx: 0,
  ry: 0,
  act: 0,
} as const;

export const STATIC_LIGHT = {
  px: 0.32,
  py: 0.28,
  la: 122,
  rx: 0,
  ry: 0,
  act: 0.62,
} as const;

export function getPreset(id: string): BadgePreset {
  return BADGE_PRESETS.find((p) => p.id === id) ?? BADGE_PRESETS[0];
}

export function patternUrlFor(
  pattern: BadgePreset["pattern"],
  override?: string,
): string {
  return override ?? PATTERN_ASSETS[pattern];
}

export function patSize(density: number): string {
  return `${120 - density * 52}%`;
}
