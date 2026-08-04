# Verification Badge

Short onboarding for engineers integrating the holographic verification label into a product UI.

This repo ships:

1. **`VerificationBadge`** — reusable React component (the thing you import)
2. **Design studio** — local tool to pick a variant, tune optics/copy, then copy the usage snippet

Design exploration for Newton · Authorization Layer — **not** a cryptographic verification system.

![Studio](docs/studio-desktop.jpg)

**Live studio:** https://alisonhu-magic.github.io/verification-badge/

---

## 1. Run the studio

```bash
npm install
npm run dev
```

Open **http://localhost:5173/verification-badge/**

In the studio:

- Hover a badge to move the light; click to focus (**Esc** to close)
- Use the right panel to set optics, interaction mode, and printed copy
- Protocol / serial support line breaks; other fields are single-line
- The **Integrate** panel shows a paste-ready snippet for the selected variant

Useful scripts: `npm test` · `npm run typecheck` · `npm run build`

---

## 2. Drop the component into your app

**Import the public API** (path-alias or relative — adjust to your monorepo):

```tsx
import {
  VerificationBadge,
  BADGE_PRESETS,
  DEFAULT_CONTENT,
  DEFAULT_OPTICS,
} from "./src/components";
```

**Bundler needs:** CSS modules + PNG imports. Peer deps: **React 18+** / **React DOM**.

**Fonts:** Suisse Intl must be available (family name `"Suisse Intl"`). Either:

```ts
import "./src/styles/fonts.css";
```

or register the faces yourself from `src/assets/fonts/`.

**Minimal usage:**

```tsx
import { VerificationBadge } from "./src/components";

export function CertificateBadge() {
  return (
    <VerificationBadge
      variant="radial-seal"
      size={280}
      content={{
        verified: "VERIFIED",
        brand: "NEWTON",
        customer: "ACME",
        protocol: "AUTHORIZATION LAYER\nSEAL",
        serial: "N° 000001",
        circular: "SECURE · GENUINE · VALID · AUTHENTIC",
      }}
      optics={{ intensity: 0.7, patOpacity: 0.55 }}
      interaction
      interactionStyle="tilt"
      onActivate={() => {
        /* e.g. open certificate detail */
      }}
    />
  );
}
```

Full example: `src/demo/examples/ProductExample.tsx`.

**What to copy into the product (not the studio):**

```
src/components/
src/hooks/
src/utils/
src/types/
src/assets/
src/styles/fonts.css   # or equivalent host fonts
```

Do **not** import `src/demo/*` in product code. No providers or env vars required.

---

## 3. Variants & props (cheat sheet)

| `variant`           | Look                      |
| ------------------- | ------------------------- |
| `radial-seal`       | Centred guilloché mandala |
| `embossed-artifact` | Ornate engraving / relief |
| `prismatic-coin`    | Aperture swirl            |
| `dark-iridescent`   | Concentric waves          |

| Prop                               | Purpose                                                            |
| ---------------------------------- | ------------------------------------------------------------------ |
| `content`                          | `verified`, `brand`, `customer`, `protocol`, `serial`, `circular`  |
| `optics`                           | `intensity`, `saturation`, `refl`, `density`, `patOpacity`, `tilt` |
| `substrate`                        | `"silver"` \| `"gold"` \| `"dark"`                                 |
| `size`                             | Square size (`number` px or CSS string)                            |
| `interaction` / `interactionStyle` | Pointer light; `tilt` \| `flat` \| `loupe` \| `sweep`              |
| `disabled` / `loading`             | Non-interactive / placeholder states                               |
| `onActivate`                       | Click / Enter / Space                                              |
| `patternSrc`                       | Override the pattern PNG URL                                       |

Defaults live in `DEFAULT_CONTENT` / `DEFAULT_OPTICS` (`src/utils/presets.ts`).

![Badge](docs/badge-detail.jpg)

---

## Notes

- Modern CSS required: `mask-image`, `mix-blend-mode`, `container-type: size`
- Canvas is **1:1** only
- Partner mark defaults to Bizantine (`src/utils/marks.ts`)
- Confirm Suisse Intl licensing before commercial ship
- GitHub Pages: Settings → Pages → Source → **GitHub Actions** (workflow already in `.github/workflows/deploy.yml`)
