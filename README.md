# Chambers marketing website

A three-page static site. No build step, no dependencies, no framework —
just HTML, one stylesheet, and images. Served by GitHub Pages.

```
index.html          the homepage
privacy.html        privacy policy
tos.html            terms of service
assets/css/style.css
assets/images/
.nojekyll           tells GitHub Pages to serve the files as-is
```

## Editing

Open the `.html` file and edit the text. There is nothing to build or compile —
what is in the file is what gets served.

The homepage is one long file of sections. Search for the text you want to change
rather than reading top to bottom. Two things to know:

- Headlines are split around an `<em>` for the italic half, e.g.
  `The operating system <em ...>for modern</em> legal practice.` Keep the spaces
  around the `<em>` or the words run together.
- Styling comes from the `class` and `style` attributes. Change the words, leave
  the attributes alone.

The header and footer are duplicated in all three files. Change one, change all three.

## Local preview

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploy

Push to `main`. GitHub Pages serves the site directly from the repository — there is
no build.

One-time setup, in the repository on GitHub → **Settings** → **Pages**:

- **Source:** Deploy from a branch
- **Branch:** `main`, folder `/ (root)`

The site then lives at `https://chambers-devs.github.io/website/`. Pushes go live in
about a minute.

### Requirement

GitHub Pages needs either a **public repository** or a paid plan (GitHub Team or
Enterprise for an organisation). This repository is currently **private** on what
appears to be a free plan, so Pages will not turn on until you either make it public
or upgrade.

### Custom domain

Add a file named `CNAME` at the repository root containing just `runchambers.com`,
then point the domain's DNS at GitHub Pages. Set the domain under Settings → Pages
as well so HTTPS is issued.

## Notes

- `index-sample.html` is the original 1.2 MB single-file export, with images and
  styles inlined. `index.html` was generated from it and verified to produce
  identical markup. It is dead weight now and will be served publicly if left in
  place — delete it with `git rm index-sample.html` when you are ready.
- The site ships zero JavaScript.
- Fonts load from Google Fonts; everything else is local.
