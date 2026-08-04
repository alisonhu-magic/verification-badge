import { useEffect, useMemo, useState } from "react";
import {
  VerificationBadge,
  BADGE_PRESETS,
  DEFAULT_CONTENT,
  DEFAULT_OPTICS,
} from "../components";
import type {
  BadgeContent,
  BadgeOptics,
  BadgeVariant,
  InteractionStyle,
} from "../components";
import styles from "./Studio.module.css";

const INTERACTION_STYLES: InteractionStyle[] = ["tilt", "flat", "loupe", "sweep"];

export function Studio() {
  const [selected, setSelected] = useState<BadgeVariant>("radial-seal");
  const [focused, setFocused] = useState<BadgeVariant | null>(null);
  const [optics, setOptics] = useState<Required<BadgeOptics>>({
    ...DEFAULT_OPTICS,
  });
  const [content, setContent] = useState<Required<BadgeContent>>({
    ...DEFAULT_CONTENT,
  });
  const [interaction, setInteraction] = useState(true);
  const [freeze, setFreeze] = useState(false);
  const [interactionStyle, setInteractionStyle] = useState<InteractionStyle>("sweep");
  const [resetFlash, setResetFlash] = useState(false);

  const selectedPreset = useMemo(
    () => BADGE_PRESETS.find((p) => p.id === selected) ?? BADGE_PRESETS[0],
    [selected],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFocused(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const importSnippet = `import { VerificationBadge } from "verification-badge";

<VerificationBadge
  variant="${selected}"
  content={{
    verified: "${escapeSnippet(content.verified)}",
    brand: "${escapeSnippet(content.brand)}",
    customer: "${escapeSnippet(content.customer)}",
    protocol: "${escapeSnippet(content.protocol)}",
    serial: "${escapeSnippet(content.serial)}",
    circular: "${escapeSnippet(content.circular)}",
  }}
  optics={{
    intensity: ${optics.intensity},
    saturation: ${optics.saturation},
    refl: ${optics.refl},
    density: ${optics.density},
    patOpacity: ${optics.patOpacity},
    tilt: ${optics.tilt},
  }}
  interaction={${interaction}}
  interactionStyle="${interactionStyle}"
/>`;

  const reset = () => {
    setOptics({ ...DEFAULT_OPTICS });
    setContent({ ...DEFAULT_CONTENT });
    setInteraction(true);
    setFreeze(false);
    setInteractionStyle("sweep");
    setResetFlash(true);
    window.setTimeout(() => setResetFlash(false), 1100);
  };

  return (
    <div className={focused ? styles.focusOpen : undefined}>
      <div className={styles.wrap}>
        <main className={styles.studio}>
          <div className={styles.sectionH}>
            <h2>Label directions</h2>
            <span>
              Move your pointer across a label — the pointer acts as the light. Click to
              focus.
            </span>
          </div>
          <section className={styles.gallery} aria-label="Holographic label directions">
            {BADGE_PRESETS.map((preset, index) => {
              const isFocused = focused === preset.id;
              const isSelected = selected === preset.id;
              if (focused && !isFocused) return null;
              return (
                <figure
                  key={preset.id}
                  className={[
                    styles.cell,
                    isSelected ? styles.cellSelected : "",
                    isFocused ? styles.cellFocused : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <VerificationBadge
                    variant={preset.id}
                    content={content}
                    optics={optics}
                    interaction={interaction}
                    interactionStyle={interactionStyle}
                    freeze={freeze}
                    sweepOffset={index * 0.9}
                    onActivate={() => {
                      setSelected(preset.id);
                      setFocused(preset.id);
                    }}
                    aria-label={`${preset.name} holographic label`}
                  />
                  <figcaption>
                    <b>
                      {preset.name}
                      <span className={styles.selbadge}>Selected</span>
                    </b>
                    <span>{preset.rationale}</span>
                  </figcaption>
                </figure>
              );
            })}
          </section>
        </main>

        <aside className={styles.controls} aria-label="Controls">
          <div className={styles.group}>
            <h3>Optics</h3>
            <RangeField
              label="Hologram intensity"
              min={0}
              max={1}
              step={0.01}
              value={optics.intensity}
              display={optics.intensity.toFixed(2)}
              onChange={(v) => setOptics((o) => ({ ...o, intensity: v }))}
            />
            <RangeField
              label="Saturation"
              min={0}
              max={2}
              step={0.01}
              value={optics.saturation}
              display={optics.saturation.toFixed(2)}
              onChange={(v) => setOptics((o) => ({ ...o, saturation: v }))}
            />
            <RangeField
              label="Reflection size"
              min={50}
              max={320}
              step={1}
              value={optics.refl}
              display={String(optics.refl)}
              onChange={(v) => setOptics((o) => ({ ...o, refl: v }))}
            />
            <RangeField
              label="Pattern density"
              min={0}
              max={1}
              step={0.01}
              value={optics.density}
              display={optics.density.toFixed(2)}
              onChange={(v) => setOptics((o) => ({ ...o, density: v }))}
            />
            <RangeField
              label="Pattern opacity"
              min={0}
              max={1}
              step={0.01}
              value={optics.patOpacity}
              display={optics.patOpacity.toFixed(2)}
              onChange={(v) => setOptics((o) => ({ ...o, patOpacity: v }))}
            />
            <RangeField
              label="Perspective tilt"
              min={0}
              max={12}
              step={1}
              value={optics.tilt}
              display={`${optics.tilt}°`}
              onChange={(v) => setOptics((o) => ({ ...o, tilt: v }))}
            />
          </div>

          <div className={styles.group}>
            <h3>Material</h3>
            <div className={styles.field}>
              <label>Cursor interaction</label>
              <div className={styles.seg}>
                {INTERACTION_STYLES.map((k) => (
                  <button
                    key={k}
                    type="button"
                    className={interactionStyle === k ? styles.segOn : undefined}
                    onClick={() => setInteractionStyle(k)}
                  >
                    {k[0].toUpperCase() + k.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className={`${styles.field} ${styles.toggle}`}>
              <span>Interaction</span>
              <span className={styles.switch}>
                <input
                  type="checkbox"
                  checked={interaction}
                  onChange={(e) => setInteraction(e.target.checked)}
                />
                <span className={styles.track} />
              </span>
            </div>
            <div className={`${styles.field} ${styles.toggle}`}>
              <span>Freeze light position</span>
              <span className={styles.switch}>
                <input
                  type="checkbox"
                  checked={freeze}
                  onChange={(e) => setFreeze(e.target.checked)}
                />
                <span className={styles.track} />
              </span>
            </div>
            <p className={styles.hint}>
              With interaction off, labels hold a considered static angle. Freeze locks
              the light where you last left it.
            </p>
          </div>

          <div className={styles.group}>
            <h3>Printed content</h3>
            <TextField
              label="Wordmark"
              value={content.verified}
              onChange={(v) => setContent((c) => ({ ...c, verified: v }))}
            />
            <div className={styles.row}>
              <TextField
                label="Left brand"
                value={content.brand}
                onChange={(v) => setContent((c) => ({ ...c, brand: v }))}
              />
              <TextField
                label="Customer"
                value={content.customer}
                onChange={(v) => setContent((c) => ({ ...c, customer: v }))}
              />
            </div>
            <TextField
              label="Protocol line"
              value={content.protocol}
              onChange={(v) => setContent((c) => ({ ...c, protocol: v }))}
              multiline
            />
            <TextField
              label="Serial"
              value={content.serial}
              onChange={(v) => setContent((c) => ({ ...c, serial: v }))}
              multiline
            />
            <TextField
              label="Circular ring text"
              value={content.circular}
              onChange={(v) => setContent((c) => ({ ...c, circular: v }))}
            />
          </div>

          <div className={styles.group}>
            <h3>Integrate</h3>
            <p className={styles.selname}>
              Selected: <b>{selectedPreset.name}</b>
            </p>
            <pre className={styles.codeHint}>{importSnippet}</pre>
            <p className={styles.hint}>
              Import <code>VerificationBadge</code> from this repo&apos;s public API — see
              README for setup.
            </p>
          </div>

          <div className={styles.group}>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnGhost}`}
              onClick={reset}
            >
              {resetFlash ? "Reset ✓" : "Reset all controls"}
            </button>
          </div>
        </aside>
      </div>

      <div
        className={styles.backdrop}
        onClick={() => setFocused(null)}
        aria-hidden={!focused}
      />
      <button
        type="button"
        className={styles.focusClose}
        aria-label="Close focus view"
        onClick={() => setFocused(null)}
      >
        ✕
      </button>
    </div>
  );
}

function RangeField({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className={styles.field}>
      <div className={styles.rowlabel}>
        <span>{label}</span>
        <span className={styles.val}>{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
      />
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <div className={styles.field}>
      <label>{label}</label>
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
        />
      )}
    </div>
  );
}

function escapeSnippet(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n");
}

export default Studio;
