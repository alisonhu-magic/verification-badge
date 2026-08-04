/** Build an SVG data-URI alpha mask for circular seal-ring text. */
export function circMaskURI(text: string | undefined | null): string | null {
  const base = (text ?? "").trim();
  if (!base) return null;

  const unit = `${base}  ·  `;
  let ring = "";
  while (ring.length < 52) ring += unit;

  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const svg =
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>" +
    "<defs><path id='cp' d='M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0'/></defs>" +
    "<text fill='#fff' font-family='Suisse Intl,Arial,sans-serif' font-size='11.5' font-weight='600' letter-spacing='2'>" +
    "<textPath href='#cp' startOffset='50%' text-anchor='middle' textLength='508' lengthAdjust='spacingAndGlyphs'>" +
    esc(ring.trim()) +
    "</textPath></text></svg>";

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    !!window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches
  );
}
