# A11yDex — Gotta Fix 'Em All!

This app has **25 accessibility bugs** hidden in the code. Your job is to find and fix them.

Each bug maps to a WCAG 2.2 AA guideline. Fix as many as you can and open a pull request to get your score.

---

## What you'll do

1. Run the app locally
2. Install the WAVE browser extension and use it to find accessibility problems
3. Fix the issues in your own branch
4. Open a PR — your site will be deployed and you'll get automated feedback

---

## Step 1: Run the app

```bash
git clone https://github.com/r-leyshon/accessibility-exercise.git
cd accessibility-exercise
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app is a chat assistant that answers accessibility questions — useful when you're stuck.

If your instructor gave you credentials, copy `.env.example` to `.env.local` and add them so the chat works. If not, you can still fix the bugs.

---

## Step 2: Install WAVE and find the bugs

1. Install the [WAVE Web Accessibility Evaluation Tool](https://wave.webaim.org/extension/) in your browser.
2. With the app running at localhost:3000, open WAVE and run an evaluation.
3. Use the WAVE report (errors, contrast issues, missing labels, etc.) to identify what needs fixing.
4. Visit `/a11ydex` to see the full list of 25 A11ymon — each one describes the bug and where it lives.

You can also use keyboard navigation, a screen reader, or zoom to 400% to find issues. WAVE is the main tool for this exercise.

---

## Step 3: Fix the bugs in your branch

Create a branch with your GitHub username:

```bash
git checkout -b access-audit/<your-github-username>
```

Then fix the accessibility issues. Edit the HTML, CSS, and components. Use semantic elements, ARIA where needed, and accessible patterns.

**Do not change these files** (they're used for scoring):

- `data/a11ymon.json`
- `scripts/`
- `.github/workflows/`
- `app/api/`
- `app/gallery/`

---

## Step 4: Open a PR

```bash
git add .
git commit -m "fix: resolve accessibility issues"
git push -u origin access-audit/<your-github-username>
```

Open a pull request against `main` on GitHub.

**What happens next:**

1. **Your branch is deployed** — Vercel builds and deploys your version of the app. You'll get a preview URL (e.g. `https://accessibility-exercise-xxx.vercel.app`).

2. **Automated checks run** — A workflow scans your code for the bug patterns, runs an accessibility audit against the deployed preview, and generates a scorecard.

3. **Feedback is posted** — A comment appears on your PR showing which A11ymon you've caught (e.g. 18/25) and what's left to fix. It includes a link to view your A11yDex progress (scores are stored per deployment, so gallery visitors see the correct count too).

4. **Improve and update** — Push more fixes to your branch. Each push triggers a new deployment and updated feedback. Aim for **25/25**.

---

## Helpful references

- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/?levels=aaa)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [GDS Service Manual — Accessibility](https://www.gov.uk/service-manual/helping-people-to-use-your-service/making-your-service-accessible-an-introduction)
- [The A11y Project](https://www.a11yproject.com/)
