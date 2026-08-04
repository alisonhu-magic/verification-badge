import type { CSSProperties, KeyboardEvent } from "react";
import type { VerificationBadgeProps } from "../../types/badge";
import { useBadgeLight } from "../../hooks/useBadgeLight";
import { circMaskURI } from "../../utils/circMask";
import {
  DEFAULT_CONTENT,
  DEFAULT_OPTICS,
  getPreset,
  patSize,
  patternUrlFor,
} from "../../utils/presets";
import {
  NEWTON_LOGO_MASK,
  NEWTON_LOGO_PATH,
  PARTNER_MASK,
  PARTNER_PATHS,
  PARTNER_VIEWBOX,
} from "../../utils/marks";
import styles from "./VerificationBadge.module.css";

export type {
  VerificationBadgeProps,
  BadgeVariant,
  BadgeSubstrate,
  BadgeContent,
  BadgeOptics,
  InteractionStyle,
} from "../../types/badge";

export function VerificationBadge({
  variant = "radial-seal",
  substrate,
  size,
  content,
  optics,
  interaction = true,
  interactionStyle = "sweep",
  freeze = false,
  disabled = false,
  loading = false,
  patternSrc,
  className,
  style,
  onActivate,
  sweepOffset = 0,
  "aria-label": ariaLabel,
}: VerificationBadgeProps) {
  const preset = getPreset(variant);
  const sub = substrate ?? preset.substrate;
  const c = { ...DEFAULT_CONTENT, ...content };
  const o = { ...DEFAULT_OPTICS, ...optics };
  const pattern = patternUrlFor(preset.pattern, patternSrc);
  const circ = circMaskURI(c.circular);
  const isEmpty = !c.verified.trim() && !c.brand.trim() && !c.customer.trim();

  const { ref, onPointerMove, onPointerLeave } = useBadgeLight({
    interaction: interaction && !disabled && !loading,
    interactionStyle,
    freeze,
    disabled: disabled || loading,
    tilt: o.tilt,
    sweepOffset,
  });

  if (loading) {
    return (
      <div
        className={[styles.root, styles.loading, className].filter(Boolean).join(" ")}
        style={sizeStyle(size, style)}
        role="status"
        aria-busy="true"
        aria-label={ariaLabel ?? "Loading verification badge"}
      >
        <span>Loading…</span>
      </div>
    );
  }

  const cssVars = {
    "--intensity": o.intensity,
    "--saturation": o.saturation,
    "--refl": o.refl,
    "--patsize": patSize(o.density),
    "--patopacity": o.patOpacity,
    "--patmask": `url("${pattern}")`,
    "--logomask": `url("${NEWTON_LOGO_MASK}")`,
    "--partnermask": `url("${PARTNER_MASK}")`,
    "--circmask": circ ? `url("${circ}")` : "none",
  } as CSSProperties;

  const label =
    ariaLabel ??
    `Newton holographic verification badge${c.customer ? ` for ${c.customer}` : ""}`;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onActivate?.();
    }
  };

  return (
    <div
      ref={ref}
      className={[styles.root, isEmpty ? styles.empty : "", className]
        .filter(Boolean)
        .join(" ")}
      style={{ ...cssVars, ...sizeStyle(size, style) }}
      data-substrate={sub}
      data-mode={interactionStyle}
      data-disabled={disabled || undefined}
      data-variant={variant}
      role="img"
      tabIndex={disabled ? -1 : 0}
      aria-label={label}
      aria-disabled={disabled || undefined}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onClick={() => {
        if (!disabled) onActivate?.();
      }}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.substrate} />
      <div className={styles.microMask} />
      <div className={styles.specular} />
      <div className={styles.loupe} />
      <div
        className={[styles.circtext, circ ? "" : styles.circtextHidden]
          .filter(Boolean)
          .join(" ")}
      />
      <div className={styles.print}>
        <div className={styles.mark}>
          <span className={`${styles.logo} ${styles.logoNewton}`}>
            <svg viewBox="0 0 400 400" aria-hidden="true">
              <path d={NEWTON_LOGO_PATH} fill="currentColor" />
            </svg>
          </span>
          <i className={styles.lx} aria-hidden="true">
            ×
          </i>
          <span className={`${styles.logo} ${styles.logoPartner}`}>
            <svg viewBox={PARTNER_VIEWBOX} aria-hidden="true">
              {PARTNER_PATHS.map((d) => (
                <path key={d.slice(0, 24)} d={d} fill="currentColor" />
              ))}
            </svg>
          </span>
        </div>
        <div className={styles.wordmark} data-text={c.verified}>
          {c.verified}
        </div>
        <div className={styles.cobrand}>
          <span>{c.brand}</span>
          <i aria-hidden="true">×</i>
          <span>{c.customer}</span>
        </div>
        <div className={styles.serial}>
          <span>{c.protocol}</span>
          <b>{c.serial}</b>
        </div>
      </div>
      <div className={styles.edge} />
    </div>
  );
}

function sizeStyle(
  size: number | string | undefined,
  style?: CSSProperties,
): CSSProperties {
  if (size == null) return { ...style };
  const value = typeof size === "number" ? `${size}px` : size;
  return { width: value, height: value, ...style };
}

export default VerificationBadge;
