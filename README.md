# A11yDex — Gotta Fix 'Em All!

An accessibility workshop exercise built as a Next.js chat application powered by Google Gemini (Vertex AI). The chatbot is an expert on **WCAG 2.2 AA** compliance and **GDS (Government Digital Service)** accessibility standards.

**The catch:** this app is _intentionally_ riddled with accessibility violations and bad design patterns. Your job is to find and fix them all.

---

## The Challenge

This application contains **25 hidden accessibility bugs** (we call them **A11ymon**). Each one maps to a specific WCAG 2.2 AA success criterion. Your mission:

1. **Identify** as many accessibility issues as you can
2. **Fix** them to make the app WCAG 2.2 AA compliant
3. **Open a PR** so your fixes are automatically audited and scored

Think of it like catching Pokemon — except the Pokemon are accessibility violations, and your Pokeball is semantic HTML.

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- A Google Cloud project with Vertex AI API enabled (your instructor will provide credentials)

### Setup

```bash
# Clone the repo
git clone https://github.com/r-leyshon/accessibility-exercise.git
cd accessibility-exercise

# Install dependencies
npm install

# Copy the example env file and fill in your GCP credentials
cp .env.example .env.local

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the (intentionally terrible) app.

### Environment Variables

Create a `.env.local` file with:

```
GCP_PROJECT_ID=your-gcp-project-id
GCP_LOCATION=europe-west2
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json
```

Your instructor will provide the GCP project ID and service account key.

---

## How to Participate

### 1. Create your branch

```bash
git checkout -b intern/<your-github-username>
```

Use your actual GitHub username. This is how we identify your submission.

### 2. Fix accessibility issues

Use these tools to find problems:

| Tool | What it catches |
|------|-----------------|
| [WAVE WebAIM Extension](https://wave.webaim.org/extension/) | Broad range of WCAG violations |
| [axe DevTools](https://www.deque.com/axe/devtools/) | Automated accessibility testing |
| [Lighthouse](https://developer.chrome.com/docs/lighthouse/) | Accessibility audit score |
| Keyboard testing | Tab through the page — can you reach and operate everything? |
| Screen reader | Try VoiceOver (Mac) or NVDA (Windows) to hear how the page sounds |
| [Colour Contrast Checker](https://webaim.org/resources/contrastchecker/) | Verify text contrast ratios |
| Browser zoom (400%) | Check content reflows without clipping |

### 3. Open a Pull Request

```bash
git add .
git commit -m "fix: resolve accessibility issues"
git push -u origin intern/<your-github-username>
```

Then open a PR against `main` on GitHub.

### 4. Get automated feedback

When you open or update your PR, a GitHub Actions workflow will:

- Scan your code for known bug patterns
- Run an axe-core accessibility audit against your deployed preview
- Generate a scorecard showing which A11ymon you've caught
- Post the results as a comment on your PR

Aim for **25/25 A11ymon caught!**

---

## Rules

- **DO** fix HTML, CSS, component code, and layout
- **DO** use semantic HTML, ARIA attributes, and accessible patterns
- **DO** test with keyboard, screen reader, and zoom
- **DO NOT** modify these files (they power the scoring system):
  - `data/a11ymon.json`
  - `scripts/`
  - `.github/workflows/`
  - `app/api/`
  - `app/gallery/`

---

## What You're Fixing

The bugs span all four WCAG principles:

- **Perceivable** — Can users perceive the content? (alt text, contrast, text size)
- **Operable** — Can users operate the interface? (keyboard, focus, timing)
- **Understandable** — Can users understand the content? (labels, errors, language)
- **Robust** — Is the content robust enough for assistive technologies? (semantic HTML, ARIA)

The chatbot ("Professor A11y") can help you understand each WCAG requirement — ask it questions as you work!

---

## Useful References

- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/?levels=aaa)
- [GDS Service Manual — Accessibility](https://www.gov.uk/service-manual/helping-people-to-use-your-service/making-your-service-accessible-an-introduction)
- [GOV.UK Design System](https://design-system.service.gov.uk/)
- [UK Accessibility Regulations](https://www.gov.uk/guidance/accessibility-requirements-for-public-sector-websites-and-apps)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [The A11y Project](https://www.a11yproject.com/)

---

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Google Vertex AI** (Gemini 2.0 Flash)
- **Playwright + axe-core** (automated auditing)

---

## For Instructors

### Deployment

The app is designed to be deployed on Vercel:

1. Connect the GitHub repo to a Vercel project
2. Set environment variables in Vercel dashboard:
   - `GCP_PROJECT_ID`
   - `GCP_LOCATION`
   - `GOOGLE_APPLICATION_CREDENTIALS` (base64-encoded service account key, or use Vercel's GCP integration)
   - `VERCEL_API_TOKEN` (for gallery page)
   - `VERCEL_PROJECT_ID` (for gallery page)
3. Set GitHub Actions secrets:
   - `GCP_PROJECT_ID`
   - `GCP_LOCATION`
   - `GCP_SA_KEY` (service account JSON)

### Gallery

Visit `/gallery` on the production deployment to see all intern submissions. The gallery automatically discovers Vercel preview deployments from `intern/*` branches.

### Reuse

The `main` branch is protected and PRs are closed without merging, so the exercise can be reused across cohorts without resetting.

### A11ymon images

To add Pokemon-themed images for each A11ydex entry, place image files in `public/a11ymon/` using zero-padded IDs (`01.png`, `02.png`, … `25.png`). See `public/a11ymon/README.md` for the full mapping and format details.
