# whoisdanish — Danish Reza's portfolio

A single-page portfolio for **Mohammed Danish Reza** — software engineer (BMW battery testing at FEV eDLP) moving into AI and agentic systems. Built from scratch with HTML, CSS and vanilla JavaScript. No build step, no framework.

**Live:** https://danish-ctrl.github.io/whoisdanish/

---

## Highlights

- **"Telemetry" visual concept** — the page reads like a test instrument, with a live dual-channel oscilloscope trace in the hero (aqua-cyan + ember).
- **NeEvo assistant** — the web face of my AI assistant, *NeEvo*, answers questions about my work right in the page. It calls a live language model when a proxy is connected, and otherwise falls back to a built-in profile, so it always responds even as a static site. Nothing leaves the browser. (The full NeEvo is a Python desktop app — chat mode, agent mode, PDF Q&A.)
- Fully responsive, keyboard-accessible, and honours `prefers-reduced-motion`.
- Contact form wired to Formspree.

---

## Project structure

```
whoisdanish/
├─ index.html              # the whole site (HTML + CSS + JS, all inline)
├─ README.md
├─ .nojekyll               # tells GitHub Pages to serve files as-is
├─ ai-proxy.worker.js      # optional Cloudflare Worker for live AI (deployed separately)
└─ assets/
   ├─ img/
   │  └─ danish.jpg        # ← add your photo. Optional — a monogram shows if it's missing.
   └─ Danish_Reza_CV.pdf   # ← add your CV. Powers the "Download CV" button.
```

Both asset paths are already referenced in `index.html`, so no code change is needed once you drop the files in.

---

## Run locally

It's a static site — open `index.html` directly, or serve it:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

---

## Add your photo & CV

- **Photo:** save a portrait image to `assets/img/danish.jpg` (a square or portrait crop works best).
- **CV:** save your resume to `assets/Danish_Reza_CV.pdf`.

If either file is absent the site degrades gracefully — a "DR" monogram stands in for the photo, and the CV button simply won't download anything.

---

## Enable the live AI model (optional)

The public site can't safely hold an API key, so by default the console answers from a built-in profile. To have the real model answer:

1. Deploy `ai-proxy.worker.js` to a free Cloudflare Worker (step-by-step instructions are in the file header).
2. Add your `ANTHROPIC_API_KEY` as a Worker secret.
3. In `index.html`, set `LLM_ENDPOINT` to your Worker URL.

The API key stays server-side and never touches the front-end.

---

## Customise

- **Colours** are CSS variables at the top of `index.html` (`:root`) — `--accent` (cyan), `--warm` (ember), plus the background / line / text tokens. Change them in one place to re-theme the whole site.
- **Content** (experience, projects, stack, certifications) is plain HTML in the matching `<section>` blocks.
- **AI answers** — edit the `PROFILE` string (used by the live model) and the `KB` array (the offline fallback) inside the console `<script>`.

---

Design & build: Mohammed Danish Reza.
