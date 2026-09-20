# Chambers website guide

## Purpose and audience

This repository is the public marketing website for **Chambers**, an AI-powered
legal-practice platform for Indian advocates and boutique law firms. The product
story is deliberately grounded in Indian legal work: active matters,
vakalatnamas, cause lists, court dates, briefs, orders, and team coordination.

Core positioning:

> Where legal work comes together.

The homepage frames Chambers as the operating system for modern legal practice:
one place for document management, task/workflow tracking, and legal research.
Keep copy clear, assured, and specific to advocates. Avoid generic enterprise
SaaS language, unsupported claims, or features that are not represented in the
current product story.

### Product vocabulary

- **ChamberVault** — matter-centric document repository: versions, tags,
  access controls, audit trails, and secure sharing.
- **ChamberFlow** — work around a matter: Kanban boards, court dates, calendar
  views, assignments, reminders, and team visibility.
- **Judgment Portal** — research across Supreme Court, High Court, and Tribunal
  judgments; search by case name, citation, judge, or keyword and save results
  to a matter.
- **Ask AI** is named in footer and pricing copy but has no dedicated marketing
  section yet. Do not create a detailed feature description without approved
  product copy.

## Technology and local workflow

- This is a static HTML site: no package manager, build step, framework, or
  application backend lives in this repository.
- Pages use the compiled Tailwind utility classes already present in
  `assets/css/style.css`, plus a small hand-authored ruleset at the end of that
  file. Do not assume Tailwind is available to compile new utility classes.
- The FAQ page additionally loads the Tailwind CDN. The other pages rely on the
  checked-in CSS file.
- Google Fonts and the FAQ page's Tailwind CDN are the intentional external
  style dependencies. Images are local.
- Preview locally with `python3 -m http.server 8000`, then open the site at
  `http://localhost:8000`.
- The README describes GitHub Pages deployment from the `main` branch/root and
  the custom domain `runchambers.com`. Confirm hosting settings before treating
  that as live deployment state.

## Repository map

```
index.html                 Homepage and product landing page
about.html                 Company and product-context page
pricing.html               Free and customised plan page
faqs.html                  Filtered FAQ/accordion page
security.html              Security/trust page (residency, encryption, access)
privacy.html               Privacy Policy
tos.html                   Terms of Service
refund.html                Refund & Cancellation Policy placeholder
assets/css/style.css       Generated Tailwind CSS + shared custom styles
assets/images/             Logo, product screenshots, and editorial photography
README.md                  Basic local-preview and deployment notes
index-sample.html          Legacy 1.2 MB inline export; not part of the active site
CNAME                      Custom domain: runchambers.com
```

`index-sample.html` is an old source/export artifact. Do not update it when
editing the active site, and do not use it as the source of truth for content or
styles.

## Sitemap and navigation

### Public HTML pages

| URL/path | Page | Notes |
| --- | --- | --- |
| `/` or `/index.html` | Home | Main marketing narrative and product sections. |
| `/about.html` | About | Mission, audience, and the three-product overview. |
| `/pricing.html` | Pricing | Free and customised plans. |
| `/faqs.html` | FAQs | Four hash-addressable categories. |
| `/security.html` | Security | Trust page: India data residency, encryption at rest/in transit, access controls. |
| `/privacy.html` | Privacy Policy | Legal prose page. |
| `/tos.html` | Terms of Service | Legal prose page. |
| `/refund.html` | Refund & Cancellation Policy | Temporary placeholder until paid plans launch. |

### Homepage anchors that currently exist

| Anchor | Destination |
| --- | --- |
| `#product` | Solution overview and product family |
| `#vault` | ChamberVault product panel |
| `#flow` | ChamberFlow product panel |
| `#judgment-portal` | Judgment Portal product panel |

### Navigation behavior and known gaps

- Desktop navigation has Products and Resources hover dropdowns. It is hidden
  below the `md` breakpoint, where a `<details class="cb-mobile-nav">` menu
  button takes over (a flat list of every nav link plus Login; styled in the
  hand-authored CSS, no JavaScript required). Login is hidden below `sm`; the
  logo, primary CTA, and menu button remain. The menu markup is duplicated in
  every page header and in `_includes/header.html`; keep them in sync.
- `index.html#about` is intentionally intercepted in `index.html` and sent to
  `about.html`. Prefer `about.html` for new links.
- Login points to `https://stage.runchambers.com`; contact/support use
  `mailto:team@runchambers.com`.
- `#trial`, `#demo`, `#resources`, and `#ask-ai` are linked in current markup
  but do not currently have matching homepage destinations. The Blog links are
  placeholders. Preserve or repair these deliberately; do not present them as
  functioning links in documentation or new designs.
- Product footer links on subpages should use `index.html#...`, not same-page
  hashes. Several existing legal-page footer links use bare hashes and therefore
  do not navigate to the homepage product sections.

## Homepage content structure

`index.html` is a long page. Its section order is:

1. Hero: positioning, primary trial CTA, demo CTA, and four benefit markers.
2. **The Problem**: scattered documents, missed deadlines, slow research.
3. **The Solution** (`#product`): matter creation, uploads, tasks, sharing,
   research; followed by the three product panels.
4. **The Audience**: market/benefit statistic grid.
5. **Where we are today**: early-access cohort and co-building message.
6. **Designed for real legal work**: three concise practical outcomes.
7. Shared footer.

Every page now has the footer, including `faqs.html` (it had none before). The
footer's look lives in the "Footer" block at the end of `assets/css/style.css`; its
markup adds a tagline and a "Back to top" link, and on subpages the Product links
must point at `index.html#...` (bare `#vault` only works on the home page).

The site header and footer are duplicated across active HTML pages, with a
slimmer header on `refund.html`. When changing shared structure, labels, contact
details, routes, or legal links, update every relevant page in the same change.
This is a static site, not a component system.

## Design system

### Fonts

- **Instrument Serif** — display headings, brand wordmark, product names, and
  occasional italic emphasis. Use normal weight `400`; italic is used to soften
  or emphasize part of a headline.
- **Helvetica Neue** — navigation, body copy, labels, controls, cards, and
  metadata (`--font-sans`, falling back to Helvetica, Arial, then system sans).
  It is a system font, not a web font: it ships with macOS and iOS and falls
  back to Arial elsewhere. Weights 400, 500, and 700 render distinctly; 600
  renders as bold.
- Only Instrument Serif is loaded from Google Fonts. Keep the existing
  preconnect and stylesheet links when creating a new page.

### Core palette

| Token/use | Value |
| --- | --- |
| Espresso text and dark CTA | `#391E03` |
| Main page surface | `#FBFBFA` (`--page-base`) |
| Warm hero tint | `#F7F1E8` (`--page-tint`) |
| Deeper warm tint | `#EFE6D7` (`--page-tint-deep`) |
| Light menu/card accent | `#D8D3B0` |
| Soft card surface | `#FCFAF5` |
| Warm rose accent used in mock UI | `#F0D8DE` |

The visual language is warm, restrained, editorial, and high-trust rather than
brightly technical. Use espresso over off-white with subtle warm tints. Borders
are usually low-contrast espresso alpha values such as `#391E031f`; dark
surfaces use off-white text and the light accent for bullets.

### Layout and interaction conventions

- Layout system (v2, hand-authored at the end of `assets/css/style.css`): one
  container (`.cb-container`, 1360px max, fluid `--gutter`), a spacing scale
  (`--space-*`) and `--section-y` for section rhythm. Page patterns:
  `.cb-hero` (headline + pitch, product shot as the hero visual), `.cb-split`
  (heading left, content right), `.cb-panels` (alternating product rows),
  `.cb-stats-grid`, `.cb-page-head` + `.cb-doc` / `.cb-doc-section` (editorial
  inner pages: h2 in a left rail, body in a right column), `.cb-plans`,
  `.cb-contact`, `.cb-faq`. Card type is `.cb-card-title` / `.cb-card-body`.
  The old `max-w-[1280px]` class is overridden to the same container width, so
  the header and footer follow it automatically.
- The fixed header is 64px tall (`h-16`) and begins transparent. The small page
  script adds `.is-scrolled` after 8px of scroll, creating a translucent,
  blurred off-white background and a subtle border.
- Headline sizes use `clamp()` and Instrument Serif; common large-heading values
  are `clamp(36px,4.6vw,68px)`. The homepage hero is larger.
- Eyebrows are compact Helvetica Neue labels: around 11–12px, uppercase, and widely
  tracked. Body copy generally runs 14–18px with generous line-height.
- Primary CTAs are espresso-filled, off-white, medium-weight, pill-shaped
  buttons. Secondary CTAs are pill-shaped with a subtle espresso outline.
- Cards/screenshots have thin warm borders, gentle shadows, and 10–16px corner
  radii. Avoid heavy shadows, saturated gradients, and sharp/square controls.
- Desktop grids switch at Tailwind's `md` breakpoint (768px); do not make new
  desktop-only layouts without a readable single-column mobile treatment.
- The product screenshots use meaningful `alt` text and `loading="lazy"`. Keep
  both practices for added imagery.

### Motion system

- `assets/js/motion.js` (no dependencies, loaded at the end of every page and in
  `_layouts/default.html`) plus the "Motion system" block at the end of
  `assets/css/style.css`. Every page also carries a one-line `<head>` snippet that
  adds `html.js` and, unless the visitor prefers reduced motion, `html.motion`.
  All hiding/offset states are keyed to `html.motion`, so reduced-motion visitors
  (and anyone whose script fails) get the plain finished page. Each hidden state
  has a timed CSS failsafe that reveals it anyway.
- Elements are tagged for reveal from JS by selector (see `initReveals`), not in
  the markup: to animate a new component, add its selector there. Headings
  (`.cb-h2`, `.cb-page-title`, `.cb-hero-title`) are split into words and rise out
  of a mask; the original text is kept as `aria-label`.
- Only `transform`, `opacity`, `clip-path` and the individual `translate` /
  `scale` / `rotate` properties are animated. Pointer effects (hero tilt, pricing
  card tilt) run only on hover-capable, non-phone screens.
- Second-pass effects: headline words rise with a tilt and a spring; the dashboard
  lands in 3D when it scrolls into view (not on a load timer) and recedes as you scroll away; rows slide in, draw their rules and brighten toward
  the middle of the screen; screenshots arrive from alternating sides and tilt on
  hover; stats pop when their count lands. Pages
  cross-fade via `@view-transition` (Chromium-based browsers; a plain navigation
  elsewhere) while the header stays put.
- Cache-busting: every page links `style.css?v=N` and `motion.js?v=N`. Bump the
  number on ALL pages (and `_layouts/default.html`) whenever either file changes,
  or visitors keep the old copy.
- There is deliberately no custom cursor, no page loader, no progress bar and no
  effect on buttons beyond the normal hover colour change.

### Shared CSS notes

- `assets/css/style.css` is large because it includes a generated Tailwind v4
  build. Make targeted edits only in its hand-authored section at the end unless
  intentionally replacing the generated CSS.
- The final rules define `--page-*` colors, header scroll state, legal `.prose`
  typography, the `.cb-nav-dropdown*` menu system, a `max-width:767px` block
  that scales the desktop spacing utilities (`px-8`, `p-8/10/12`, `pt-36`, ...)
  down for phones, and the `.cb-mobile-nav` menu. Later duplicated CSS
  selectors override earlier ones; read the final declaration before changing a
  shared dropdown rule.
- Legal-page body content uses `.prose`. Maintain its readable 15.5px/1.7
  rhythm, serif `h2` headings, understated links, and list spacing.
- FAQ-specific category and accordion styles are intentionally inline in
  `faqs.html`.

## Assets

| Asset | Intended use |
| --- | --- |
| `logo.png` | Favicon and header/footer brand icon |
| `chambers-home.png` | Homepage dashboard/product overview |
| `chambers-matters.png` | ChamberVault panel |
| `chambers-tasks.png` | ChamberFlow panel |
| `dashboard.png` | Social/image asset; current homepage OG URL needs a slash fix |
| `advocate-portrait.jpg`, `case-notes.jpg`, `law-library.jpg` | Editorial legal-work photography |

Use local assets via paths relative to the HTML file, e.g.
`assets/images/chambers-home.png`. Keep image dimensions and accurate alt text.

## Editing guidance

1. Read the target page and `assets/css/style.css` before changing layout or
   style. Preserve the existing visual system unless a design change is
   explicitly approved.
2. For a visual/design request, first share suggestions and obtain approval
   before implementing the design edits.
3. Keep headline markup intact: the italic portion of display headlines is an
   `<em>` element, and the whitespace around it matters.
4. New pages should copy the established document head (viewport, font links,
   favicon, title, description, shared stylesheet), the fixed header, the shared
   footer, and the header-scroll script. Add a canonical and social metadata
   when the production URL is known.
5. Update titles, descriptions, canonical links, and Open Graph metadata with
   any meaningful page/content change. Current `index.html` has an incorrect
   `og:image` path (`https://runchambers.comassets/...`); correct it to include
   the slash when SEO metadata is touched.
6. Preserve semantic HTML: one `h1` per page, logical heading order, descriptive
   image alternatives, keyboard-usable links, and native `<details>` FAQ items.
7. Verify links and hash targets after navigation changes. Do not introduce
   placeholder `href="#"` values for destinations that should work.
8. Run a local preview for visual or navigation edits. Check desktop and a
   narrow viewport, header scroll state, footer routes, and FAQ behavior where
   applicable.

## JavaScript boundary

JavaScript is deliberately minimal and page-local:

- The homepage, About, Pricing, Privacy, and Terms pages use a short
  header-scroll script. The streamlined refund page does not.
- `index.html` redirects the legacy `#about` link/hash to `about.html`.
- `pricing.html` modifies the visible pricing intro and plan feature lists after
  page load; take care when restructuring its card DOM because the script uses
  child positions.
- `faqs.html` uses a category sidebar/hash state and native FAQ accordions,
  keeping one category and one expanded answer active at a time.

Avoid adding frameworks, tracking, or large client-side behavior without an
explicit requirement. If a new interactive component is necessary, favor small,
accessible, progressive-enhancement code.

## Open questions

- Contact form submission flow: decide with the team whether submissions should
  continue using the temporary email flow or be sent to a Google Sheet through a
  dedicated endpoint.
- Contact form thank-you experience: decide whether to add a post-submission
  thank-you screen with a button back to the homepage.

## Quality checks before handoff

- Inspect `git diff` to ensure only intended files changed.
- Check all updated internal and external links, including mobile-visible CTAs.
- Use local preview to inspect spacing, type, image cropping, dropdowns, and
  the header’s scrolled state.
- Confirm that a new page appears in the header/footer or is intentionally
  excluded, and add it to this sitemap when appropriate.
- Never commit credentials, tokens, or local environment files.
