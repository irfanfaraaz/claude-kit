# Firecrawl Brand Data → Remotion Mapping

When a video features a product/company, scrape the site first with:

```bash
bash scripts/firecrawl.sh "https://example.com"
```

Then map the response into your Remotion project as below.

## Firecrawl Response Shape

Typical fields: `brandName`, `tagline`, `headline`, `description`, `features` (array), `logoUrl`, `faviconUrl`, `primaryColors` (array), `ctaText`, `socialLinks`, plus screenshot URL and OG image URL from the scrape response.

## Mapping to Remotion

### 1. Download Assets

```bash
mkdir -p public/images/brand
curl -s "LOGO_URL" -o public/images/brand/logo.svg
curl -s "FAVICON_URL" -o public/images/brand/favicon.png
curl -s "OG_IMAGE_URL" -o public/images/brand/og-image.png
curl -sL "SCREENSHOT_URL" -o public/images/brand/screenshot.png
```

### 2. Use in Components

```tsx
import { Img, staticFile } from "remotion";

<Img src={staticFile("images/brand/logo.svg")} alt={brandName} />
<Img src={staticFile("images/brand/og-image.png")} />
```

### 3. Brand Colors → CSS / Tailwind

- **Option A — CSS variables in Root or index.css:**

```css
:root {
  --brand-primary: #hex1;
  --brand-secondary: #hex2;
}
```

Set these from `primaryColors[0]`, `primaryColors[1]` (or parse from scrape; ensure fallbacks if missing).

- **Option B — Pass as props:** Add `brandColors: string[]` to composition `defaultProps` and use inline styles or Tailwind arbitrary values: `style={{ color: brandColors[0] }}`.

### 4. Copy → Props

Pass scrape result (or a subset) as composition defaultProps or via `getInputProps()`:

```tsx
defaultProps: {
  brandName: "...",
  tagline: "...",
  headline: "...",
  features: ["...", "..."],
  ctaText: "...",
}
```

Use in scene components for headlines, feature lists, and CTA button text.

### 5. TypeScript Type (optional)

```ts
export type BrandData = {
  brandName: string;
  tagline?: string;
  headline?: string;
  description?: string;
  features?: string[];
  logoUrl?: string;
  faviconUrl?: string;
  primaryColors?: string[];
  ctaText?: string;
};
```

Use for typed `defaultProps` or fetch result.
