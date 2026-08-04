import type { CSSProperties } from "react";

export type BadgeVariant =
  "radial-seal" | "embossed-artifact" | "prismatic-coin" | "dark-iridescent";

export type BadgeSubstrate = "silver" | "gold" | "dark";

export type InteractionStyle = "tilt" | "flat" | "loupe" | "sweep";

export interface BadgeContent {
  /** Large wordmark, e.g. "VERIFIED" */
  verified?: string;
  /** Left brand in the cobrand line, e.g. "NEWTON" */
  brand?: string;
  /** Right brand / customer in the cobrand line */
  customer?: string;
  /** Protocol line under cobrand */
  protocol?: string;
  /** Serial line */
  serial?: string;
  /** Circular seal-ring text; empty string hides the ring */
  circular?: string;
}

export interface BadgeOptics {
  intensity?: number;
  saturation?: number;
  /** Specular reflection radius in px */
  refl?: number;
  /** Pattern density 0..1 (maps to mask size) */
  density?: number;
  /** Pattern ink opacity 0..1 */
  patOpacity?: number;
  /** Perspective tilt amplitude in degrees (tilt mode) */
  tilt?: number;
}

export interface VerificationBadgeProps {
  /** Design direction / pattern preset */
  variant?: BadgeVariant;
  substrate?: BadgeSubstrate;
  /** Square size in CSS pixels; defaults to 100% of parent width */
  size?: number | string;
  content?: BadgeContent;
  optics?: BadgeOptics;
  /** When false, holds a static lit angle */
  interaction?: boolean;
  /** Interaction mode for light / perspective */
  interactionStyle?: InteractionStyle;
  /** Lock light at last pointer position */
  freeze?: boolean;
  /** Disable pointer interaction and dim activation */
  disabled?: boolean;
  /** Show a loading placeholder instead of the badge */
  loading?: boolean;
  /** Optional override for the pattern image URL */
  patternSrc?: string;
  className?: string;
  style?: CSSProperties;
  /** Called when the badge is activated (click / Enter / Space) */
  onActivate?: () => void;
  /** Phase offset for auto-sweep mode when multiple badges are on screen */
  sweepOffset?: number;
  "aria-label"?: string;
}

export interface BadgePreset {
  id: BadgeVariant;
  name: string;
  substrate: BadgeSubstrate;
  pattern: "p1" | "p2" | "p3" | "p4";
  rationale: string;
}
