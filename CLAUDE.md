# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

This is a static personal portfolio website (badrkacimi.github.io) — plain HTML/CSS/JS with no build tooling, package manager, or framework. There is no `package.json`, no bundler, and no test suite.

## Development workflow

- Open `index.html` directly in a browser, or serve the directory with any static file server (e.g. `python3 -m http.server`) to test relative paths/fonts correctly.
- SCSS source lives in `scss/` but is not compiled by any script in this repo — `css/styles.css` and `css/styles.css.map` are the committed compiled output. If you edit `scss/*.scss`, you must compile it yourself (e.g. via the Dart Sass CLI: `sass scss/styles.scss css/styles.css`) and commit both the SCSS and the regenerated CSS/map.
- There is no linter or test command configured. Verify changes by loading the page in a browser.

## Architecture

- `index.html` is a single-page site; all content sections live in one file, each wrapped in `<section class="... section" id="...">` (`home`, `sessions`, `articles`, `videos`, `hobbies`, `certifications`, `contact`). Navigation links scroll to these anchors.
- `scss/_variables.scss` defines all design tokens (colors, spacing, font sizes, z-index) as CSS custom properties on `:root`, plus a `body.dark-theme` override block for dark mode. `scss/styles.scss` imports variables and holds all component styles nested with the parent-selector (`&`) pattern. Always add new design tokens to `_variables.scss` rather than hardcoding values, and add both light and dark values when a color is theme-sensitive.
- `js/main.js` is one plain-JS file (no modules/bundler) containing independent, self-guarding feature blocks — each queries its DOM elements at the top and wraps its logic in `if (element_exists) { ... }` so the script tolerates sections not being present on the page. When adding a new interactive feature, follow this same guarded-block pattern rather than assuming elements exist.
- Several content sections (`sessions`/events, `videos`, `hobbies`, `certifications`) use a shared horizontal-carousel pattern: a `.{name}-carousel` scroll container wrapping a `.{name}-slider`, with prev/next buttons (`{name}PrevBtn`/`{name}NextBtn`) and an auto-scroll helper (`startOnePassAutoScroll` for one-shot, or a `setInterval`-based auto-advance for the videos carousel). Reuse this pattern for any new carousel section instead of inventing a new one.
- The `articles` section is populated dynamically at runtime by `fetchMediumArticles()`, which pulls the Medium RSS feed via `rss2json.com` and falls back to the hardcoded `sampleArticles` array if the fetch fails. Article cards are built with DOM APIs (`createElement`/`textContent`), not `innerHTML`, specifically to avoid XSS from feed content — preserve this when touching `createMediumArticleCard`.
- The contact form submits via EmailJS (`emailjs.init(...)` / `emailjs.sendForm(...)`) using a public key and service/template IDs hardcoded in `js/main.js`. These are EmailJS public identifiers (not secret keys) but should still not be casually changed without understanding the corresponding EmailJS account setup.
- Theme (light/dark) and its icon state are persisted to `localStorage` (`selected-theme`, `selected-icon`) and applied on load before other scripts run.
