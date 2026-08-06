# Yahao Ren — Personal Research Blog

A GitHub Pages site for research, writing, and open-source projects. Public notes are authored as Markdown and rendered by Jekyll.

## Local preview

Static assets can still be inspected with:

```powershell
python -m http.server 4173
```

Then open `http://127.0.0.1:4173/`. This simple server does not process Jekyll or Liquid; GitHub Pages is the authoritative preview for generated note pages.

## Structure

- `index.html` — home
- `research/` — research overview and public work
- `writing/` — essays and research notes
- `_notes/` — Markdown sources for public notes
- `_layouts/note.html` — generated note-page layout
- `_templates/blog-note.md` — Obsidian note template
- `projects.html` — selected projects
- `about.html` — public biography
- `assets/` — shared styles, interaction, and favicon
- `rss.xml`, `sitemap.xml`, `robots.txt` — discovery metadata

## Deployment

This site is designed for the GitHub user-site repository `yahaoren.github.io`. Publish the `main` branch with GitHub Pages using **Deploy from a branch**, root folder `/`. GitHub Pages runs the Jekyll build automatically after each push.

## Writing from Obsidian

Open the repository root as an Obsidian Vault and follow [`OBSIDIAN_SETUP.md`](OBSIDIAN_SETUP.md). A note is included in the website only when its front matter contains `published: true`.

## Content boundaries

- Public project facts are sourced from the `YahaoRen` GitHub profile and repositories.
- Submission-stage research is labeled as submission / under review, not publication.
- Anonymous review materials, private contact details, and unconfirmed affiliation details are intentionally excluded.
- The repository is public. `published: false` prevents page generation but does not make the Markdown source private.
