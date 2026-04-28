# Portfolio (GitHub Pages)

This is a lightweight static portfolio you can host on **GitHub Pages** (no build step).

## Customize

Open `index.html` and update:

- Name, headline, and about text
- Email (`you@example.com`)
- LinkedIn URL
- Project cards (titles, descriptions, stack, links)
- Optional resume: put your PDF at `assets/Subham-Chauhan-Resume.pdf` (or change the link)

## Run locally

Any static server works. For example:

```bash
cd portfolio
python3 -m http.server 5174
```

Then open `http://localhost:5173`.

## Deploy to GitHub Pages

1. Push this repo to GitHub (you already have `origin` set).
2. In GitHub, go to **Settings → Pages**.
3. Under **Build and deployment**:
   - **Source**: Deploy from a branch
   - **Branch**: `main`
   - **Folder**: `/ (root)`
4. Save — your site will be available at:
   - `https://<username>.github.io/<repo>/`

If you use a custom domain, add a `CNAME` file at repo root.
