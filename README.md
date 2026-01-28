# Digital vCard Template (JSON-driven)

A lightweight, self-hosted digital business card built around a single JSON file.  
Includes vCard (.vcf) download, QR code modal, native share button, social links, reviews, and multiple demo themes.

## Demos

- demo-1: https://vcard-demo.co.uk/liamt/vcard/index.html  
- demo-2: https://vcard-demo.co.uk/miras/vcard/index.html

## Repository structure

```
/
├─ start-here.html
├─ demo-1/
│  ├─ Assets/                  # PNG + PSD source files (optional, for design edits)
│  └─ vcard/
│     ├─ index.html
│     ├─ cardData.json         # main editable content file
│     ├─ vcard.bundle.js
│     ├─ styles/
│     │  └─ style.css
│     ├─ scripts/
│     │  └─ qrcode.min.js
│     └─ images/
└─ demo-2/
   ├─ Assets/                  # PNG + PSD source files (optional)
   └─ vcard/                   # identical structure to demo-1
      ├─ index.html
      ├─ cardData.json
      ├─ vcard.bundle.js
      ├─ styles/
      │  └─ style.css
      ├─ scripts/
      │  └─ qrcode.min.js
      └─ images/
```

## Themes

This repository includes two example themes:

- demo-1: more masculine-leaning styling (bolder colours and contrast)
- demo-2: more feminine-leaning styling (softer colours and tones)

Both demos use the same template and functionality.  
Only styling, images, and sample data differ.

## What to edit

### 1) `vcard/cardData.json` (main content)

All editable content lives in `cardData.json`, including:

- name, job title, company
- phone numbers, email, website
- social profiles (and enable/disable flags)
- bio and company description
- review link and rating
- QR modal text
- footer text and link
- profile and cover images
- share title and text

Edit values inside quotes only.  
Do not remove commas, keys, or brackets.

### 2) `vcard/index.html` (social sharing + metadata)

Social platforms do not execute JavaScript. For correct link previews, update these directly in `index.html`:

- `<title>`
- `<meta name="author">`
- `<meta name="description">`
- favicon and Apple touch icon links (use absolute URLs)
- Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`)
- Twitter/X tags (`twitter:title`, `twitter:description`, `twitter:image`, `twitter:url`)

All URLs must be absolute and publicly accessible.

### 3) Images and styling

- Replace images inside `vcard/images/`
- Keep filenames or update paths in both:
  - `cardData.json`
  - `index.html`
- Optional: adjust theme variables in `styles/style.css`
- Optional: edit source PSDs inside `Assets/`

## Running locally (important)

This template uses a strict Content Security Policy (CSP).  
Because of this, and because JSON is fetched, the project cannot be run via `file://` (double-clicking `index.html`).

Use a local web server.

Recommended:

- Visual Studio Code + Live Server
- Any local HTTP server

Example:

```
http://127.0.0.1:5500/demo-1/vcard/index.html
```

Local warnings may appear if production URLs are used in meta tags.  
These do not affect the deployed site.

## Deployment

1. Edit `vcard/cardData.json`
2. Update meta tags and absolute URLs in `vcard/index.html`
3. Replace images as required
4. Upload the entire `vcard/` folder to your hosting
5. Access it at `https://yourdomain.com/vcard/`

## Multi-user setups

For teams or clients:

```
/john/vcard/
/jane/vcard/
/alex/vcard/
```

Each folder must have its own:

- `cardData.json`
- images
- updated `index.html` meta tags

## Open source

This project is open source.

You may:

- use it for personal and commercial projects
- modify the code, styling, and structure
- redistribute it according to the repository licence

See the `LICENSE` file for full terms.
