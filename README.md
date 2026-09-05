# runchambers.com

The Chambers marketing site. Plain HTML pages plus a Jekyll-powered blog,
built and deployed by GitHub Actions on every push to `main`.

```
index.html  about.html  pricing.html      hand-written pages, edited directly
faqs.html   privacy.html tos.html refund.html

_posts/                  blog articles (Markdown)   -> /blog/<slug>/
blog/index.html          the blog listing page      -> /blog/
_layouts/                page shell + post template  (blog only)
_includes/               shared header and footer    (blog only)
_config.yml              Jekyll settings
assets/css/style.css     the stylesheet
assets/images/
.github/workflows/pages.yml   the build
```

---

## Adding a blog post

**1. Create a file in `_posts/`** named `YYYY-MM-DD-your-title.md`:

```
_posts/2026-09-12-why-matter-context-matters.md
```

The date must be at the front, and the rest of the filename becomes the URL:

```
https://runchambers.com/blog/why-matter-context-matters/
```

Use lowercase words separated by hyphens. No spaces, no capitals.

**2. Put this at the top of the file**, between the two `---` lines:

```markdown
---
title: "Why matter context matters"
date: 2026-09-12
description: "One sentence. Shows on the blog list and in Google results."
---

Write the article here.
```

**3. Write the article** in Markdown below the second `---`:

```markdown
## A heading

A normal paragraph. Make words **bold** or *italic*, and
[link like this](https://runchambers.com).

- a bullet
- another bullet

> A pull quote.
```

**4. Commit and push to `main`.** The build runs automatically and the article
is live in a minute or two. Nothing else to do — the blog listing page and the
URL are generated for you.

### Gotchas

- **A post dated in the future will not appear.** This is deliberate — it lets
  you write ahead. It goes live on its own once the date arrives *and* something
  is next pushed to `main`.
- The filename date and the `date:` in the front matter should match.
- Keep the quotes around `title:` and `description:` — a colon in your headline
  breaks the file without them.
- Deleting a post's file removes it from the site.

---

## Editing the ordinary pages

Open the `.html` file and change the words. Leave the `class` and `style`
attributes alone — those are the design.

Two things worth knowing:

- Headlines are split around an `<em>` for the italic half, e.g.
  `The operating system <em ...>for modern</em> legal practice.` Keep the spaces
  around the `<em>` or the words run together.
- The header and footer are **copied into each page** and have drifted apart.
  Changing a nav or footer link means changing it in every `.html` file, and in
  `_includes/` for the blog. See *Known rough edges* below.

## Local preview

For the plain HTML pages, any static server works:

```bash
python3 -m http.server 8000
```

To preview the blog you need Jekyll, because `/blog/` is generated:

```bash
bundle exec jekyll serve
```

Or just push to a branch and open a pull request — the build runs there too.

## How the deploy works

`.github/workflows/pages.yml` runs on every push to `main`: it builds the site
with Jekyll and publishes the result to GitHub Pages. Build logs are under the
repository's **Actions** tab, which is where to look if a post does not show up.

**One-time setting:** repository **Settings → Pages → Build and deployment →
Source** must be set to **GitHub Actions**. If it is still on *Deploy from a
branch*, the workflow will build but the deploy step will fail.

The `CNAME` file keeps the custom domain pointed at `runchambers.com`.

## Known rough edges

- **The stylesheet is a compiled Tailwind build, not live Tailwind.** Only the
  utility classes already in `assets/css/style.css` work. Inventing a new one
  (say `md:col-span-3`) silently does nothing. Either reuse a class already in
  the file, or hand-add the rule at the bottom of the stylesheet — there is a
  small block of these there already.
- Header and footer markup is duplicated across seven pages and has drifted;
  `faqs.html` has no footer at all. Converting the pages to use `_includes/`
  would fix this — the machinery is already in place for the blog.
- `#resources` and `#trial` in the nav point at anchors that do not exist on the
  homepage.
