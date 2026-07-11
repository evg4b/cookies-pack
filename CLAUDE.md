# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Cookies Pack is a Chrome (Manifest V3) extension for managing browser cookies: add/delete cookies, bulk-import from a raw HTTP header string, and export to JetBrains HTTP Client `.cookies` format. Built with React 19 + TypeScript + Mantine UI, bundled with Vite via `@crxjs/vite-plugin`.

## Commands

Package manager is Yarn (Berry, `node-modules` linker) — use `yarn`, not `npm`. Node version is pinned in `.nvmrc` (24).

- `yarn dev` — start Vite dev server with the extension in dev mode (`__DEV__=true`, uses `*.dev.svg`/`.dev.png` icons and a `DEV:` name prefix, see `manifest.config.ts`)
- `yarn build` — type-check (`tsc -b`) then production build to `dist/`, and zip a release artifact into `release/`
- `yarn lint` — ESLint over `src/`
- `yarn test` — run the Vitest suite (watch mode by default; CI runs `yarn test --run`)
- `yarn test:ui` — Vitest with the browser UI
- `yarn test:coverage` — Vitest with v8 coverage
- Run a single test file: `yarn test src/core/hooks/__tests__/chrome.test.ts`
- Run tests matching a name: `yarn test -t "removeCookie"`

CI (`.github/workflows/ci.yml`) runs lint, test, and build as separate parallel jobs on every push to `main` and every PR — keep all three green independently.

## Architecture

### Two entry points, one shared UI

The extension has no background service worker — it's UI-only. There are two HTML entry points that both render the same root component:

- `src/popup/main.tsx` → toolbar popup (`CookiesPackThemeProvider mode="popup"`)
- `src/sidepanel/main.tsx` → side panel (`CookiesPackThemeProvider mode="sidebar"`)

Both wrap `<CookiesPack/>` (`src/core/components/CookiesPack.tsx`), which composes `SupportingWrapper` (guards against unsupported URLs like `chrome://`), `CookiesTable`, and `CookiesBatchUpdate`. The `mode` prop threads through `useModeValue` (`src/core/theme/provider.tsx`) so components can render differently depending on whether they're in the popup vs. the side panel (e.g. textarea row count).

### State: external stores via `useSyncExternalStore`, no global state library

There is no Redux/Zustand/Context-based state manager. Both stateful hooks follow the same pattern — a module-level store object (closures over mutable state + a `Set` of listeners) exposed to React through `useSyncExternalStore`:

- `src/core/hooks/chrome.ts` (`useCookies`) — single shared store for the active tab's cookies. Loads cookies for the active tab's URL, and re-syncs automatically on `chrome.cookies.onChanged`, `chrome.tabs.onActivated`, and `chrome.tabs.onUpdated` (URL change). Exposes `setCookie`, `removeCookie`, `removeAllCookies`, `getCookie`, `refresh`.
- `src/core/hooks/settings.ts` (`useChromeStorageState` + `useClearExistingCookiesFirst`/`useCustomPath`) — a per-key store backed by `chrome.storage.sync`, memoized in a `Map<key, store>` so multiple components sharing a key stay in sync, including across `chrome.storage.sync.onChanged`.

When extending cookie or settings state, follow this store pattern rather than introducing `useState`/Context for cross-component state.

`ChromeContext` in `chrome.ts` exists so `chrome` (and thus `useTabs`) can be swapped out in tests.

### i18n

There's no i18n library — translation goes straight through the extension's native `chrome.i18n.getMessage`. `useTranslation(namespace)` (`src/core/hooks/useTranslation.ts`) returns a `t(key)` function that looks up `${namespace}_${key}` in `public/_locales/{en,ru}/messages.json`. When adding UI copy, add the key to both locale files under the appropriate namespace (e.g. `cookies_table_*`, `cookies_batch_update_*`, `supporting_wrapper_*`).

### Cookie format conversions

`src/core/utils/cookieHeader.ts` and `jetbrainsCookies.ts` handle the two supported interchange formats:
- `parseCookieHeader` / `joinCookiesHeader` — semicolon-newline-separated `name=value` pairs (the raw HTTP `Cookie:` header format used for paste/copy).
- `encodeJetbrainsCookies` — tab-separated `domain\tpath\tname\tvalue\tdate` format matching JetBrains' HTTP Client cookie jar, including its specific expiration date string format.

### Path aliases

`@src/*`, `@core/*` (→ `src/core/*`), `@shared/*` are defined in both `tsconfig.app.json` and `vite.config.ts` — keep them in sync if adding new aliases. Barrel files (`components/index.ts`, `hooks/index.ts`, `utils/index.ts`) are the intended import surface for `@core/components`, `@core/hooks`, `@core/utils`.

### Testing

- Vitest + `@testing-library/react`, jsdom environment, global test APIs enabled (no `import { describe, it } from 'vitest'` needed).
- Setup file `src/test/setup.ts` installs jest-dom matchers, `mock-match-media`, and a `ResizeObserver` polyfill (Mantine components rely on both).
- Tests live in `__tests__` directories alongside the code they cover.
- `src/core/hooks/__tests__/` is excluded from coverage reporting (see `vite.config.ts`), since these mock the `chrome.*` APIs heavily.
- Aim for new code to be covered by Vitest tests wherever practical (components, hooks, utils).

## Conventions

- Default to `@mantine/core` / `@mantine/hooks` components, hooks, and style props (`style`, `gap`, `p`, etc. via Mantine's style props system) instead of custom components or third-party UI libraries. Reach for a custom component only when Mantine has no equivalent.
- Avoid hardcoded style objects and other inline styles (`style={{ ... }}`, ad-hoc CSS-in-JS). Prefer Mantine style props, theme tokens (`src/core/theme/theme.ts`), and CSS classes/modules over inline styles.
