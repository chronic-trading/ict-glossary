# ICT Glossary

Every ICT & SMC term, visualised. Each concept has a plain-language definition and
a hand-drawn diagram (with abbreviations where they apply) — searchable, filterable
by category, and deep-linkable per term. Includes a **Diagram Quiz** (name the concept from its
diagram) and a "learned" tracker so you can work through the framework
systematically.

Part of the **Chronic Trading** suite alongside [Trading Lab](https://chronic-trading.github.io/trading-lab/)
(the model builder) and the [ICT Replay Trainer](https://chronic-trading.github.io/ict-replay/).

## Stack

- **React 19** + **TypeScript** + **Vite 8**
- **Tailwind CSS 4** for utilities; component colors flow from CSS custom
  properties (`--gl-*`) so themes stay consistent
- **lucide-react** for iconography
- Diagrams are inline SVG components (`src/diagrams.tsx`) — no image assets

## Running locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to dist/
```

No account or backend is required — the glossary runs entirely in the browser.
Learned terms and quiz best (`ict:learned`, `ict:quiz-best`) are kept in
`localStorage`. If you're signed into Trading Lab in the same browser,
`src/lib/crossSync.ts` mirrors progress into the shared session; signed out, it's
a no-op and everything stays local.

## Theming

Warm light is the default; dark is opt-in via `<html data-theme="dark">`. Both
themes are defined as token sets in `src/index.css` (`--gl-*`). The token
contract is kept in sync across trading-lab / ict-replay / ict-glossary.

## Source layout

- `src/App.tsx` — search, category browser, term cards, stats
- `src/QuizMode.tsx` — diagram quiz
- `src/terms.ts` — every term, its category, abbreviation, and example
- `src/diagrams.tsx` — the inline SVG diagram for each concept
- `src/lib/crossSync.ts` — cross-site progress sync (defensive; local-first)

Deployed to GitHub Pages on push to `main`.
