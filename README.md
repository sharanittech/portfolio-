# Portfolio
Personal portfolio website for Sharan R showcasing skills, projects, education, and contact details.

## Structure
- `index.html` main page
- `style.css` styling
- `script.js` interactions/animations
- `sharan resume.pdf` resume download
- `*.jpg` / `*.png` assets

## Features
- Project filters and case study modal with radar chart
- Theme toggle
- Resume download counter (local)
- Milestones

## Run Locally
Open `index.html` directly in a browser, or serve locally:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Configuration Notes
- Update the Formspree endpoint in `index.html` to receive contact form submissions.
- Replace project GitHub links with the actual repository URLs.

## Image Optimization
Images have been converted to WebP for faster load times. To re-run conversion:

```bash
python convert_images.py
```
