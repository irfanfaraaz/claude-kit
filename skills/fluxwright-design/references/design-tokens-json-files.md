# Design Tokens — JSON Files

Moved here word for word from SKILL.md, to keep SKILL.md short.

## Contents

- Design Tokens — JSON Files
  - tokens/colors.json
  - tokens/spacing.json
  - tokens/typography.json


## Design Tokens — JSON Files

### tokens/colors.json
```json
{
  "$schema": "https://design-tokens.github.io/community-group/format/",
  "core": {
    "text-primary": {
      "value": "#0a0a0a",
      "role": "text-primary",
      "name": "color-fg"
    },
    "text-muted": {
      "value": "#9a9a9a",
      "role": "text-muted",
      "name": "color-muted"
    },
    "surface": {
      "value": "#f7f4ee",
      "role": "surface",
      "name": "color-bg"
    },
    "accent": {
      "value": "#c8f135",
      "role": "accent",
      "name": "color-primary"
    },
    "background": {
      "value": "#ffffff",
      "role": "background",
      "name": "tw-ring-offset-color"
    },
    "border": {
      "value": "#333333",
      "role": "border",
      "name": "color-rule"
    }
  },
  "status": {},
  "extended": {
    "color-primary": {
      "value": "#497d00",
      "role": "unknown",
      "name": "color-primary"
    },
    "color-rule": {
      "value": "#d8d4cc",
      "role": "unknown",
      "name": "color-rule"
    }
  },
  "meta": {
    "theme": "light",
    "extracted": "2026-04-15"
  }
}
```

### tokens/spacing.json
```json
{
  "base": {
    "value": "4px",
    "description": "Grid unit — all spacing must be multiples of this"
  },
  "unit": "px",
  "scale": {
    "xs": {
      "value": "2px",
      "px": 2
    },
    "sm": {
      "value": "4px",
      "px": 4
    },
    "md": {
      "value": "6px",
      "px": 6
    },
    "lg": {
      "value": "8px",
      "px": 8
    },
    "xl": {
      "value": "10px",
      "px": 10
    },
    "2xl": {
      "value": "12px",
      "px": 12
    },
    "3xl": {
      "value": "14px",
      "px": 14
    },
    "4xl": {
      "value": "16px",
      "px": 16
    },
    "5xl": {
      "value": "20px",
      "px": 20
    },
    "6xl": {
      "value": "24px",
      "px": 24
    }
  },
  "multipliers": {
    "1x": {
      "value": "4px",
      "raw": 4
    },
    "2x": {
      "value": "8px",
      "raw": 8
    },
    "3x": {
      "value": "12px",
      "raw": 12
    },
    "4x": {
      "value": "16px",
      "raw": 16
    },
    "5x": {
      "value": "20px",
      "raw": 20
    },
    "6x": {
      "value": "24px",
      "raw": 24
    },
    "7x": {
      "value": "28px",
      "raw": 28
    },
    "8x": {
      "value": "32px",
      "raw": 32
    },
    "9x": {
      "value": "36px",
      "raw": 36
    },
    "10x": {
      "value": "40px",
      "raw": 40
    },
    "11x": {
      "value": "44px",
      "raw": 44
    },
    "12x": {
      "value": "48px",
      "raw": 48
    },
    "13x": {
      "value": "52px",
      "raw": 52
    },
    "14x": {
      "value": "56px",
      "raw": 56
    },
    "15x": {
      "value": "60px",
      "raw": 60
    },
    "16x": {
      "value": "64px",
      "raw": 64
    }
  },
  "meta": {
    "totalValues": 15,
    "min": 2,
    "max": 80
  }
}
```

### tokens/typography.json
```json
{
  "families": [
    "Google Sans",
    "Google Sans Code",
    "SFMono-Regular"
  ],
  "scale": {
    "heading-1": {
      "fontFamily": "Google Sans",
      "fontSize": "3rem",
      "fontWeight": "700",
      "lineHeight": null,
      "source": "css"
    },
    "heading-2": {
      "fontFamily": "Google Sans",
      "fontSize": "clamp(1.75rem,3.5vw,2.75rem)",
      "fontWeight": "700",
      "lineHeight": null,
      "source": "css"
    },
    "body": {
      "fontFamily": "Google Sans Code",
      "fontSize": "1rem",
      "fontWeight": "400",
      "lineHeight": null,
      "source": "css"
    },
    "caption": {
      "fontFamily": "Google Sans Code",
      "fontSize": "clamp(1.375rem,2.5vw,2rem)",
      "fontWeight": "400",
      "lineHeight": null,
      "source": "css"
    },
    "code": {
      "fontFamily": "SFMono-Regular",
      "fontSize": "14px",
      "fontWeight": "400",
      "lineHeight": null,
      "source": "css"
    }
  },
  "fontFaces": [
    {
      "family": "Google Sans",
      "src": "https://fonts.gstatic.com/s/googlesans/v67/4Ua_rENHsxJlGDuGo1OIlJfC6l_24rlCK1Yo_Iqcsih3SAyH6cAwhX9RFD48TE63OOYKtrwEIKli.ttf",
      "format": "truetype",
      "weight": "400"
    },
    {
      "family": "Google Sans",
      "src": "https://fonts.gstatic.com/s/googlesans/v67/4Ua_rENHsxJlGDuGo1OIlJfC6l_24rlCK1Yo_Iqcsih3SAyH6cAwhX9RFD48TE63OOYKtrw2IKli.ttf",
      "format": "truetype",
      "weight": "500"
    },
    {
      "family": "Google Sans Code",
      "src": "https://fonts.gstatic.com/s/googlesanscode/v17/pxihyogzv91QhV44Z_GQBHsGf5PuckJMZfIVTPZaiXEp_ht12EVEHsN1sCQNrGPVsw.ttf",
      "format": "truetype",
      "weight": "600"
    },
    {
      "family": "Google Sans Code",
      "src": "https://fonts.gstatic.com/s/googlesanscode/v17/pxihyogzv91QhV44Z_GQBHsGf5PuckJMZfIVTPZaiXEp_ht12EVEHsN1sCQNlWPVsw.ttf",
      "format": "truetype",
      "weight": "700"
    }
  ],
  "rules": {
    "maxSizesPerScreen": 4,
    "headingWeightRange": "600-700",
    "bodyWeight": 400,
    "lineHeightBody": 1.5,
    "lineHeightHeading": 1.2
  }
}
```
