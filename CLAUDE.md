# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Jermel Lapaz, built with Astro 6, React 19, and Tailwind CSS 4. Single-page layout with section-based navigation (About, Skills, Work, Experience, Contact).

## Commands

- `pnpm dev` — start dev server
- `pnpm build` — production build
- `pnpm preview` — preview production build
- `npx eslint .` — lint (ESLint with TypeScript, Astro, Prettier, and jsx-a11y plugins)
- `npx prettier --check .` — check formatting

Package manager is **pnpm** (v11.7.0). Node >= 22.12.0.

## Architecture

**Astro components** (`.astro`) handle all static layout and pages. **React components** (`.tsx`) are used only for interactive UI that needs client-side hydration — currently the `BottomSheet` component (wraps `@silk-hq/components` Sheet).

React components are hydrated via Astro's `client:*` directives (e.g., `client:media="(max-width: 48rem)"`). Don't add React where an Astro component with a `<script>` tag suffices.

### Key patterns

- **Theme system**: Three-mode toggle (light/system/dark) using `data-theme` attribute on `<html>` and CSS `light-dark()` function. Theme is persisted in `localStorage` under key `"theme"`. An inline script in `Layout.astro` prevents flash of unstyled theme. Theme transitions use the View Transitions API when available.
- **Design tokens**: Semantic color variables defined in `globals.css` using CSS custom properties with `light-dark()`. Exposed to Tailwind via `@theme inline` block (e.g., `bg-primary`, `text-muted-foreground`).
- **Navigation**: Desktop nav uses scroll-spy via `IntersectionObserver`-style logic to highlight active section. Mobile nav uses a `BottomSheet` (Silk UI) rendered only below `48rem` via `client:media`.
- **Utility function**: `cn()` in `src/lib/utils.ts` — `clsx` + `tailwind-merge` for conditional class merging.

### Path aliases

Configured in `tsconfig.json`: `@assets/*`, `@components/*`, `@layouts/*`, `@pages/*`, `@lib/*`, `@styles/*`, `@/*` (all resolve to `./src/...`).

### Data layer

Static data lives in `src/lib/data/` as typed TypeScript constants (e.g., `profile.ts`, `links.ts`). Used by both Astro frontmatter and client-side scripts.

### Styling: use the styles declared in `globals.css`

**Default to the design tokens and base styles defined in `src/styles/globals.css`** — reach for raw values only when the use case genuinely isn't covered there.

- **Colors**: use the semantic token utilities (`bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`, `bg-primary`, `border-border`, `ring-ring`, `bg-destructive`, etc.) exposed via the `@theme inline` block. Don't hardcode hex values or use Tailwind's default palette (`bg-gray-900`, `text-zinc-500`, …) — those bypass the `light-dark()` theme system.
- **Typography**: headings (`h1`–`h6`), `label`, `input`, and `button` already have base font sizes, weights, and line-heights from the `@layer base` rules. Prefer semantic elements over restyling a `<div>`, and don't re-declare sizes that the base layer already sets unless the design needs to deviate.
- When a value truly isn't declared (a one-off size, a new semantic color), add it as a token in `globals.css` rather than scattering literals, if it's likely to be reused.

### Styling: use logical Tailwind utilities (RTL support)

This site is built to support RTL languages, so **always use flow-relative/logical Tailwind classes instead of physical ones**. Existing code follows this — e.g. `max-inline-5xl`, `inline-full`, `block-1.5`, `mbs-4`, `pbe-*`.

- Sizing: `inline-*` / `block-*` (not `w-*` / `h-*`), `max-inline-*` / `max-block-*`
- Margin: `ms-*` / `me-*` / `mbs-*` / `mbe-*` (not `ml/mr/mt/mb`)
- Padding: `ps-*` / `pe-*` / `pbs-*` / `pbe-*` (not `pl/pr/pt/pb`)
- Position/align: `start-*` / `end-*`, `text-start` / `text-end`, `items-center-safe`
- Inset: `inset-bs-*` / `inset-be-*` / `inset-s-*` / `inset-e-*` (not `top-*` / `bottom-*` / `left-*` / `right-*`)
- Borders/radius: `border-s-*` / `border-e-*`, `rounded-s-*` / `rounded-e-*`

## Formatting

- Tabs for indentation, 100-char print width
- Prettier plugins: `prettier-plugin-astro`, `prettier-plugin-tailwindcss`
- Font: Inter via Astro's built-in font provider (Fontsource)
