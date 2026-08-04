# Verification Badge

Holographic security-label UI as a reusable React component, plus a design studio demo.

This is a design exploration of holographic verification artifacts — **not** a production authentication system.

**Live demo:** https://alisonhu-magic.github.io/verification-badge/

## Quick start

```bash
npm install
npm run dev
```

Open the local Vite URL (usually `http://localhost:5173/verification-badge/`).

## Scripts

| Command                | Purpose                                   |
| ---------------------- | ----------------------------------------- |
| `npm run dev`          | Start the design studio                   |
| `npm run build`        | Type-check and production build → `dist/` |
| `npm run preview`      | Preview the production build              |
| `npm run typecheck`    | TypeScript project check                  |
| `npm run lint`         | ESLint                                    |
| `npm run format`       | Prettier write                            |
| `npm run format:check` | Prettier check                            |
| `npm test`             | Vitest unit/component tests               |

## Repository structure

```
src/
  components/
    VerificationBadge/     # Public UI component + CSS module + tests
    index.ts               # Barrel exports
  hooks/                   # Pointer / light rAF hook
  utils/                   # Presets, circ-mask, mark paths
  types/                   # Shared TypeScript types
  styles/                  # Fonts + demo shell tokens
  demo/                    # Studio application (not for product import)
    examples/              # Minimal integration example
  assets/
    fonts/                 # Suisse Intl (400–700)
    patterns/              # Guilloché PNGs (p1–p4)
```

## Public component API

### Import

```tsx
import {
  VerificationBadge,
  BADGE_PRESETS,
  DEFAULT_CONTENT,
  DEFAULT_OPTICS,
} from "./src/components";
// or, once wired into your monorepo / package alias:
// import { VerificationBadge } from "verification-badge";
```

Also load the font face (or provide an equivalent `@font-face` in the host app):

```ts
import "./src/styles/fonts.css";
```

Pattern PNGs are imported by the component; Vite (or your bundler) must support `*.png` imports.

### Example

```tsx
import { VerificationBadge } from "./src/components";

export function CertificateBadge() {
  return (
    <VerificationBadge
      variant="radial-seal"
      size={280}
      substrate="silver"
      content={{
        verified: "VERIFIED",
        brand: "NEWTON",
        customer: "ACME",
        protocol: "GENUINE PROTOCOL ARTIFACT",
        serial: "N° 000001",
        circular: "SECURE · GENUINE · VALID · AUTHENTIC",
      }}
      optics={{ intensity: 0.7, patOpacity: 0.55 }}
      interaction
      interactionStyle="tilt"
      onActivate={() => {}}
    />
  );
}
```

See `src/demo/examples/ProductExample.tsx`.

### Props (`VerificationBadgeProps`)

| Prop                  | Type                                                                            | Default               | Notes                       |
| --------------------- | ------------------------------------------------------------------------------- | --------------------- | --------------------------- |
| `variant`             | `"radial-seal" \| "embossed-artifact" \| "prismatic-coin" \| "dark-iridescent"` | `"radial-seal"`       | Pattern direction           |
| `substrate`           | `"silver" \| "gold" \| "dark"`                                                  | preset default        | Metal look                  |
| `size`                | `number \| string`                                                              | parent width          | Square CSS size             |
| `content`             | `BadgeContent`                                                                  | see `DEFAULT_CONTENT` | Printed copy                |
| `optics`              | `BadgeOptics`                                                                   | see `DEFAULT_OPTICS`  | Intensity, density, etc.    |
| `interaction`         | `boolean`                                                                       | `true`                | Pointer-driven light        |
| `interactionStyle`    | `"tilt" \| "flat" \| "loupe" \| "sweep"`                                        | `"sweep"`             | Light behavior              |
| `freeze`              | `boolean`                                                                       | `false`               | Lock light position         |
| `disabled`            | `boolean`                                                                       | `false`               | Blocks interaction          |
| `loading`             | `boolean`                                                                       | `false`               | Placeholder state           |
| `patternSrc`          | `string`                                                                        | preset PNG            | Override mask image         |
| `className` / `style` | —                                                                               | —                     | Host styling                |
| `onActivate`          | `() => void`                                                                    | —                     | Click / Enter / Space       |
| `sweepOffset`         | `number`                                                                        | `0`                   | Phase for multi-badge sweep |
| `aria-label`          | `string`                                                                        | auto                  | Accessible name             |

**States:** normal, hover/pointer light, focus-visible, active (keyboard/click), disabled, loading, empty content (missing primary text), circular ring hidden when `content.circular` is blank.

## Integration into another React product

1. Copy or path-alias `src/components`, `src/hooks`, `src/utils`, `src/types`, and `src/assets` into the host app (or consume this repo as a workspace package).
2. Ensure the host bundler handles CSS modules and PNG imports.
3. Register Suisse Intl via `src/styles/fonts.css` (or host-owned `@font-face` with the same family name).
4. Peer dependencies: **React 18+** and **React DOM**.
5. No environment variables or context providers are required.
6. Do **not** import `src/demo/*` into product code — that is the studio shell only.

## Styling & assets

- Component styles are CSS modules (`VerificationBadge.module.css`) — no global label CSS required.
- Demo shell styles live in `src/styles/demo.css` and `src/demo/Studio.module.css`.
- Required assets: `src/assets/patterns/p1.png`–`p4.png`, Suisse Intl TTFs under `src/assets/fonts/`.
- Confirm Suisse Intl licensing before shipping in a commercial product.

## Deploy (GitHub Pages)

`vite.config.ts` sets `base: "/verification-badge/"`. Pushing to `main` runs `.github/workflows/deploy.yml`, which builds and publishes `dist/`.

In the GitHub repo settings, set Pages source to **GitHub Actions**.

## Known limitations

- Optical effects rely on CSS `mask-image`, `mix-blend-mode`, and `container-type: size` — require modern browsers.
- Auto-sweep / pointer light is decorative; it is not a cryptographic verification signal.
- Partner mark defaults to the Bizantine lockup baked into `src/utils/marks.ts`.
- Canvas is **1:1 only** (multi-ratio formats intentionally omitted).
- String “Generate component” codegen has been removed; use real imports.
- This package is private / source-copy oriented — not published to npm by default.

## License / notice

Design exploration for Newton · Authorization Layer. Treat as an internal design handoff unless otherwise licensed.
