# ChatGPT Prompt: Generate A11ymon Character Assets

Copy everything below the line into ChatGPT.

---

## Context

I'm building an **A11ydex** — a Pokedex-style catalogue for an accessibility workshop. Each entry is an "A11ymon": a Pokémon-inspired character representing a specific web accessibility bug (e.g. missing alt text, poor contrast, no skip link). The workshop teaches developers to find and fix these bugs ("catching" them).

I need 25 character images, one for each A11ymon. Each character's name is a pun combining a Pokémon name with the accessibility issue (e.g. "Altless Abra" = missing alt text + Abra, "Contrast Cubone" = poor contrast + Cubone). The images will appear in a card grid on the A11ydex page.

**Important:** Until a user "finds" (fixes) that bug, the image should appear as a greyed-out outline/silhouette — like an undiscovered entry in a Pokedex. We will achieve this effect with CSS filters (e.g. `filter: grayscale(1) brightness(0) contrast(0.3)`) on the full-colour image, so **you only need to generate the full-colour version**. Do not generate a separate outline/silhouette asset.

---

## Requirements

- **Format:** PNG
- **Size:** 96×96 pixels (or 192×192 for retina; we display at 96×96)
- **Style:** Cute, Pokemon-inspired character art. Simple, readable shapes that work well at small size. Consistent style across all 25 characters.
- **Optimisation:** Web-optimised (compressed, transparent or light background). Aim for &lt;20KB per image if possible.
- **Content:** Each character should visually suggest both the Pokémon it’s named after AND the accessibility concept (subtle is fine — e.g. Abra with a "?" over its head for "missing info", Cubone with blurry/low-contrast features).

---

## The 25 A11ymon (generate one image per ID)

| ID | Name | Accessibility bug (design inspiration) |
|----|------|----------------------------------------|
| 01 | **Altless Abra** | Missing alt text on images |
| 02 | **Decorative Diglett** | Decorative images exposed to screen readers |
| 03 | **Imagey Igglybuff** | Text rendered as an image instead of real text |
| 04 | **Contrast Cubone** | Insufficient colour contrast |
| 05 | **Tiny Tentacool** | Text too small (font-size issues) |
| 06 | **Colourblind Chansey** | Information conveyed by colour alone |
| 07 | **Zoomy Zubat** | Content clipped when zooming |
| 08 | **Landmarkless Lapras** | Missing semantic HTML landmarks |
| 09 | **Heading Haunter** | Skipped heading levels |
| 10 | **Skipless Skarmory** | No skip-to-content link |
| 11 | **Titleless Togepi** | Generic or missing page title |
| 12 | **Focusless Fearow** | No visible focus indicators |
| 13 | **Vague Vulpix** | Vague link text ("click here") |
| 14 | **Tabindex Teddiursa** | Illogical tab order (tabindex abuse) |
| 15 | **Trapped Tangela** | Focus trapped in a dropdown |
| 16 | **Marquee Magikarp** | Auto-playing content with no pause |
| 17 | **Tiny Target Tyrogue** | Touch targets too small |
| 18 | **Langless Larvitar** | Missing language attribute |
| 19 | **Labelless Lickitung** | Form inputs without labels |
| 20 | **Errorless Eevee** | Errors indicated by colour only |
| 21 | **Inconsistent Ivysaur** | Inconsistent navigation order |
| 22 | **Buttonless Bulbasaur** | Buttons without accessible names |
| 23 | **Divvy Ditto** | Clickable divs instead of buttons |
| 24 | **Linkless Ledyba** | Empty or meaningless links |
| 25 | **Statusless Snorlax** | Dynamic content not announced (no aria-live) |

---

## Output

Save each image with the filename matching the ID: `01.png`, `02.png`, … `25.png`. Generate them one at a time (or in small batches) so you can maintain style consistency. Describe the visual concept for each before generating if that helps you stay consistent.
