import { useCallback, useEffect, useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { clamp01, prefersReducedMotion } from "../utils/circMask";
import { NEUTRAL_LIGHT, STATIC_LIGHT } from "../utils/presets";
import type { InteractionStyle } from "../types/badge";

export interface LightState {
  px: number;
  py: number;
  la: number;
  rx: number;
  ry: number;
  act: number;
}

interface UseBadgeLightOptions {
  interaction: boolean;
  interactionStyle: InteractionStyle;
  freeze: boolean;
  disabled: boolean;
  tilt: number;
  /** Phase offset for auto-sweep (radians-ish via time) */
  sweepOffset?: number;
}

export function useBadgeLight({
  interaction,
  interactionStyle,
  freeze,
  disabled,
  tilt,
  sweepOffset = 0,
}: UseBadgeLightOptions) {
  const ref = useRef<HTMLDivElement>(null);
  const cur = useRef<LightState>({ ...NEUTRAL_LIGHT });
  const tgt = useRef<LightState>({
    ...(interaction && !disabled ? NEUTRAL_LIGHT : STATIC_LIGHT),
  });
  const rect = useRef<DOMRect | null>(null);
  const pointerActive = useRef(false);
  const raf = useRef(0);
  const reduce = useRef(prefersReducedMotion());

  const applyStatic = useCallback(() => {
    Object.assign(tgt.current, STATIC_LIGHT);
  }, []);

  const applyNeutral = useCallback(() => {
    Object.assign(tgt.current, NEUTRAL_LIGHT);
  }, []);

  useEffect(() => {
    if (disabled || !interaction) {
      applyStatic();
      pointerActive.current = false;
    } else if (!freeze) {
      applyNeutral();
    }
  }, [disabled, interaction, freeze, applyStatic, applyNeutral]);

  useEffect(() => {
    const tick = () => {
      const el = ref.current;
      const c = cur.current;
      const t = tgt.current;

      if (
        interaction &&
        !disabled &&
        !freeze &&
        interactionStyle === "sweep" &&
        !pointerActive.current &&
        !reduce.current
      ) {
        const ph = (performance.now() / 1000) * 0.6 + sweepOffset;
        const px = 0.5 + 0.42 * Math.cos(ph);
        const py = 0.5 + 0.3 * Math.sin(ph * 1.3);
        t.px = px;
        t.py = py;
        t.act = 0.85;
        t.la = 90 + (px - 0.5) * 120;
        t.rx = 0;
        t.ry = 0;
      } else if (
        interaction &&
        !disabled &&
        !freeze &&
        interactionStyle === "sweep" &&
        !pointerActive.current &&
        reduce.current
      ) {
        Object.assign(t, STATIC_LIGHT);
      }

      const k = reduce.current ? 1 : 0.14;
      c.px += (t.px - c.px) * k;
      c.py += (t.py - c.py) * k;
      c.la += (t.la - c.la) * k;
      c.rx += (t.rx - c.rx) * k;
      c.ry += (t.ry - c.ry) * k;
      c.act += (t.act - c.act) * k;

      if (el) {
        el.style.setProperty("--px", c.px.toFixed(4));
        el.style.setProperty("--py", c.py.toFixed(4));
        el.style.setProperty("--la", `${c.la.toFixed(2)}deg`);
        el.style.setProperty("--rx", `${(reduce.current ? 0 : c.rx).toFixed(3)}deg`);
        el.style.setProperty("--ry", `${(reduce.current ? 0 : c.ry).toFixed(3)}deg`);
        el.style.setProperty("--act", c.act.toFixed(3));
      }

      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [interaction, interactionStyle, freeze, disabled, sweepOffset]);

  const onPointerMove = useCallback(
    (e: ReactPointerEvent) => {
      if (!interaction || disabled || freeze) return;
      const el = ref.current;
      if (!el) return;
      pointerActive.current = true;
      if (!rect.current) rect.current = el.getBoundingClientRect();
      const r = rect.current;
      const px = clamp01((e.clientX - r.left) / r.width);
      const py = clamp01((e.clientY - r.top) / r.height);
      const t = tgt.current;
      t.px = px;
      t.py = py;
      t.act = 1;
      t.la = 90 + (px - 0.5) * 120;
      const tiltOn = interactionStyle === "tilt";
      t.rx = tiltOn ? -(py - 0.5) * tilt * 2 : 0;
      t.ry = tiltOn ? (px - 0.5) * tilt * 2 : 0;
    },
    [interaction, disabled, freeze, interactionStyle, tilt],
  );

  const onPointerLeave = useCallback(() => {
    rect.current = null;
    pointerActive.current = false;
    if (interaction && !disabled && !freeze) applyNeutral();
  }, [interaction, disabled, freeze, applyNeutral]);

  const invalidateRect = useCallback(() => {
    rect.current = null;
  }, []);

  useEffect(() => {
    const onResize = () => {
      rect.current = null;
    };
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", onResize, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize);
    };
  }, []);

  return {
    ref,
    onPointerMove,
    onPointerLeave,
    invalidateRect,
  };
}
