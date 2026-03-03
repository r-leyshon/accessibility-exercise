# A11ymon images

Pokemon-themed images for each entry in the A11ydex.

## File naming

Place images in this folder using **zero-padded two-digit IDs** matching the A11ymon IDs in `data/a11ymon.json`:

| Filename | A11ymon |
|----------|---------|
| `01.png` | Altless Abra |
| `02.png` | Decorative Diglett |
| `03.png` | Imagey Igglybuff |
| ... | ... |
| `25.png` | Statusless Snorlax |

## Supported formats

- **PNG** (recommended)
- **JPG** / **JPEG** — use `01.jpg` instead of `01.png`
- **WebP** — use `01.webp`

If you use JPG or WebP, update the `getA11ymonImageSrc` function in `app/a11ydex/page.tsx` to use the correct extension, or add an optional `image` field to each entry in `data/a11ymon.json`.

## Recommended size

96×96 pixels or any square aspect ratio. Images are displayed at 96×96 with `object-fit: contain`, so larger images will scale down without distortion.

## Placeholder behaviour

If an image file is missing, the card shows a dashed placeholder with the A11ymon ID. Add images gradually — the UI works with or without them.

## Optimisation

After adding or replacing images, run `npm run optimize:a11ymon` to resize all images to 192×192px and compress for web. This reduces file sizes by ~98%.
