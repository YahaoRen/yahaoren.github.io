# Yahao Ren — Personal Research Blog

A dependency-free static personal site for research, writing, and open-source projects.

## Local preview

From this directory, run:

```powershell
python -m http.server 4173
```

Then open `http://127.0.0.1:4173/`.

## Structure

- `index.html` — home
- `research/` — research overview and public work
- `writing/` — essays and research notes
- `projects.html` — selected projects
- `about.html` — public biography
- `assets/` — shared styles, interaction, and favicon
- `rss.xml`, `sitemap.xml`, `robots.txt` — discovery metadata

## Deployment

This site is designed for the GitHub user-site repository `yahaoren.github.io`. It has no build step. Publish the `main` branch with GitHub Pages using **Deploy from a branch**, root folder `/`.

## Content boundaries

- Public project facts are sourced from the `YahaoRen` GitHub profile and repositories.
- Submission-stage research is labeled as submission / under review, not publication.
- Anonymous review materials, private contact details, and unconfirmed affiliation details are intentionally excluded.
