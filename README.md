# Quantum Biology DAO — Website

The official site for the Quantum Biology DAO.

Built with [Astro](https://astro.build), styled with [Tailwind CSS](https://tailwindcss.com), and deployed on [Cloudflare Pages](https://pages.cloudflare.com).

## Local development

```sh
npm install
npm run dev
```

The dev server runs at <http://localhost:4321>.

## Available commands

| Command           | What it does                                  |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Start the local dev server with live reload   |
| `npm run build`   | Build the production site into `dist/`        |
| `npm run preview` | Preview the production build locally          |

## Project structure

```
qbio-dao-website/
├── homepage-assets/    Raw photos & graphics (source files, not deployed)
├── brand/              Raw brand assets — fonts, logo PNGs (source files, not deployed)
├── public/             Static assets served as-is (favicon, fonts, og-image)
├── src/
│   ├── components/     Reusable page pieces
│   ├── layouts/        Page shells (Layout.astro = the <html>/<head>/<body> wrapper)
│   ├── pages/          Each .astro file in here becomes a page on the site
│   └── styles/         Global CSS — design tokens live in global.css
└── astro.config.mjs    Astro configuration (Tailwind v4 is configured in CSS via @theme)
```

## Design tokens

Brand colors and fonts are defined in `src/styles/global.css` inside an `@theme` block.
They're exposed to Tailwind as utility classes — for example:

- `bg-plum-darkest`, `bg-plum-dark`, `bg-mauve`, `bg-pink`, `bg-pink-light`, `bg-cream`, `bg-paper`
- `text-…` variants of the same
- `font-sans` (Apercu) and `font-display` (Chap)
