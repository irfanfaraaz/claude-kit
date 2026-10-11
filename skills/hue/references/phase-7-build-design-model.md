# Phase 7: Build Design Model

Moved here word for word from SKILL.md, to keep SKILL.md short.

## Contents

  - Phase 7: Build Design Model


### Phase 7: Build Design Model
Create a `design-model.yaml` in the skill folder as the **Single Source of Truth**. If the skill folder doesn't exist yet, create it now (default location from Phase 9) — don't wait until Phase 9 to make the directory. This file captures every design decision in a structured, machine-readable format. All subsequent files (tokens.md, components.md, platform-mapping.md, previews) are generated FROM this model.

The YAML has two token layers: **Primitives** (raw ramps) and **Semantic** (role-based tokens referencing primitives).

```yaml
name: "Aster"
philosophy: "A quiet reading room for research. Warm paper, ink text, one plum accent."
primary_mode: "light"
brand_domain: "research notes / citation management"
brand_type: "ui-rich"    # or "content-rich"
mono_for_code: true      # code blocks, file paths, shell commands, inline technical tokens
mono_for_metrics: false  # pricing, counts, timestamps, percentages, ID strings
# locked_weight: 400     # OPTIONAL. Set only when the brand genuinely uses a single font weight across all text. Most brands do not — leave unset. If set, ALL type scale rows use this weight; the `weight` column becomes "—" in the scale table (or a single row at the top of the table).
# Backwards-compat: older skills may have `mono_for_data: true/false`. Treat `mono_for_data: true` as `mono_for_code: true + mono_for_metrics: true`, and `false` as both false.

# ── PRIMITIVES ── Raw scales derived from brand analysis
primitives:
  colors:
    neutral:    # Temperature matches the brand (warm/cool/pure)
      50: "#FAF8F5"
      100: "#F3F0EA"
      200: "#E6E1D8"
      300: "#D4CEC2"
      400: "#A8A193"
      500: "#7E776A"
      600: "#5F594E"
      700: "#48433A"
      800: "#322E27"
      900: "#211E19"
      950: "#14120E"
    brand:      # Accent hue, 500 = primary
      50: "#FBF1F7"
      100: "#F6E0EC"
      200: "#ECC2DA"
      300: "#DA97BE"
      400: "#BC6597"
      500: "#8E3D6E"
      600: "#76305B"
      700: "#5E2649"
      800: "#471C37"
      900: "#321326"
      950: "#1F0A17"
    red:   { 50: "#FEF2F2", 500: "#E5484D", 900: "#7F1D1D" }
    green: { 50: "#F0FDF4", 500: "#4AB66A", 900: "#14532D" }
    amber: { 50: "#FFFBEB", 500: "#E5A73B", 900: "#78350F" }
  spacing: [0, 1, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 96]
  radii: [0, 2, 4, 6, 8, 12, 16, 24, 999]
  # NOTE: The default radii scale above is a SUPERSET — trim unused values for the brand.
  #   Pill-first brands (Cursor, Stripe pill CTAs)    → radii: [0, 4, 8, 999]
  #   Sharp / hard-edge brands (Linear, Nothing)      → radii: [0, 2, 4]
  #   Soft-but-not-round brands (Notion, Apple)       → radii: [0, 4, 8, 12, 16]
  # RULE: Radii primitives should only contain values the brand actually uses. A scale
  # with 9 values but only 2 referenced is a signal that you over-sampled. After generating
  # semantic tokens, audit the primitives — any primitive value not referenced by a semantic
  # token must be removed.

# ── SEMANTIC TOKENS ── Roles that reference primitives
tokens:
  colors:
    light:
      background: "{neutral.50}"
      surface1: "{neutral.100}"
      surface2: "{neutral.200}"
      surface3: "{neutral.300}"
      border: "{neutral.200}"
      border_visible: "{neutral.300}"
      text1: "{neutral.900}"
      text2: "{neutral.600}"
      text3: "{neutral.500}"
      text4: "{neutral.400}"
      accent: "{brand.500}"
      accent_subtle: "{brand.50}"
    dark:
      background: "{neutral.950}"
      surface1: "{neutral.900}"
      surface2: "{neutral.800}"
      surface3: "{neutral.700}"
      border: "{neutral.800}"
      border_visible: "{neutral.700}"
      text1: "{neutral.50}"
      text2: "{neutral.400}"
      text3: "{neutral.500}"
      text4: "{neutral.600}"
      accent: "{brand.400}"
      accent_subtle: "{brand.950}"
    success: "{green.500}"
    warning: "{amber.500}"
    error: "{red.500}"
    # Status tints — backgrounds behind status text/badges (foreground stays the 500 step).
    # Derivation rule: light mode = lightest ramp step (50), dark mode = darkest (900).
    success_bg: { light: "{green.50}", dark: "{green.900}" }
    warning_bg: { light: "{amber.50}", dark: "{amber.900}" }
    error_bg:   { light: "{red.50}",   dark: "{red.900}" }

  spacing:
    2xs: 2
    xs: 4
    sm: 8
    md: 16
    lg: 24
    xl: 32
    2xl: 48
    3xl: 64
    4xl: 96

  radii:
    element: 4      # small controls, checkboxes
    control: 6      # buttons, inputs
    component: 8    # cards, panels
    container: 12   # modals, sheets
    pill: 999       # pills, tags (if brand uses them)

  typography:
    # Families + base sizes. tokens.md derives the full 7-token type scale from these:
    # --display, --heading, --subheading, --body, --body-sm, --caption, --label (canonical names,
    # identical in tokens-template.md and platform-mapping-template.md).
    display: { family: "Spectral", size: "34px", weight: 500, line_height: 1.15 }
    body: { family: "Hanken Grotesk", size: "15px", weight: 400, line_height: 1.5 }
    mono: { family: "IBM Plex Mono", size: "12px", weight: 400 }

  elevation:
    strategy: "subtle"
    # ...

  motion:
    personality: "smooth"
    easing: "ease-in-out"
    duration_fast: "120ms"
    duration_normal: "220ms"

  # Hero stage — composed background + optional hero subject + relation.
  # Mandatory. Replaces the older `background_graphics` block.
  # See references/hero-stage.md for the full dial reference.
  hero_stage:
    preset: "painterly-no-hero"   # or null for fully manual
    observed_style:
      description: "Soft ink-wash fields in plum and paper tones; no foreground subject — the wash IS the hero."
      where_used: ["hero", "feature sections"]
    background:
      medium: "painterly"         # gradient / mesh / painterly / shader / pattern / bokeh / sculptural / noise / photo / absent
      color_mode: "palette"       # monochrome / dual-tone / palette / brand-tinted-neutral
      saturation: "muted"         # flat / muted / vibrant / neon
      light_source: "ambient"     # top / bottom / top-l..br / center / ambient / none
      falloff: "soft"             # hard / soft / radial / linear
      vignette: "off"             # off / subtle / strong
      texture: "paper"            # clean / grain / paper / paint / pixel
      motion: "static"            # static / drift / pulse / reactive
      intensity: "subtle"         # subtle / bold / blown-out  ← default subtle
      safe_zone: "full-bleed"     # full-bleed / masked-for-text / edge-only
      color_palette: ["#DA97BE", "#8E3D6E", "#E6E1D8", "#A8A193", "#FAF8F5"]
    hero:
      subject: "none"             # none / luminous / object / device / composition / photo-cutout  ← intent, not form
      # form: "sphere"            # sphere / disc / ring / torus — ONLY for luminous. Ignored for everything else.
      # placement, scale, tint ignored when subject: none
      # NOTE for `object`: concrete physical products render as a generic warm metallic
      #                    form (decorative placeholder). The user swaps it for their
      #                    own 3D render / product photo before shipping. The form
      #                    doesn't resemble the product — it just holds the slot.
    relation:
      type: "flat"                # flat / glow / halo / reflection / emissive / shadow-only
      bleed: 0                    # 0-100, how much subject light spills into background
      # Compat: see subject × relation matrix in references/hero-stage.md.
      # Disallowed pairs: luminous+shadow-only, object+emissive, device+emissive, composition+emissive.
    disclaimer: "Approximated with SVG + CSS. The real brand uses commissioned illustrations not redistributed with this skill."

  # Dual-track iconography — brand reality + our fallback.
  # The skill renders `fallback_kit`; `observed_style` documents truth.
  iconography:
    observed_style:
      description: "Custom 1.75px outline icons with rounded terminals. Humanist with slight irregularity. Not from any standard kit."
      stroke_weight: "regular"
      corner_treatment: "soft"
      fill_style: "outline"
      form_language: "humanist"
      visual_density: "balanced"
    fallback_kit:
      name: "Phosphor"
      weight: "regular"        # thin / light / regular / bold / fill / duotone
      match_score: "high"      # high / medium / low
      match_reasoning: "Phosphor regular matches the observed stroke weight (~1.5px), rounded terminals, and humanist form language. Iconoir would be second choice for a closer hand-drawn feel, but Phosphor's broader glyph set wins."
      cdn: "https://unpkg.com/@phosphor-icons/web@2/src/regular/style.css"
      icon_class_prefix: "ph ph-"
    disclaimer: "Icons in the generated preview are a best-match fallback from the Phosphor kit. The brand's actual icons are proprietary and not redistributed with this skill."

components:
  button_primary:
    source: "observed"
    background: "{brand.500}"
    color: "#FFFFFF"
    padding: "10px 16px"
    radius: "{radii.control}"
    font_weight: 500
    hover: { background: "{brand.600}" }
  # ...

# App screen — product UI rendered inside a device frame.
# Required for Phase 13 generation.
app_screen:
  archetype: "list-detail"  # dashboard / editor / list-detail / feed / conversational / canvas
  frame: "browser"          # browser / phone / desktop / tablet
  frame_params:
    url: "app.aster.ink/library"     # browser only — fictional domain
    title: "Aster — Library"
  content_seed: "citation library for a climate-paper draft"   # one-line description of what the screen shows
  required_tokens_checklist:
    - "background, surface1, surface2, surface3, border, border_visible"
    - "text1, text2, text3, text4"
    - "accent, accent_subtle, success, warning, error"
    - "all typography scale tokens"
    - "all spacing tokens used in components"
```

**How to generate the primitives:**
- **Neutral ramp:** Extract the brand's gray temperature (warm/cool/pure) from the analysis. Generate a 50-950 ramp that matches. Warm brand → warm-tinted grays. Cool brand → cool-tinted.
- **Brand ramp:** The accent color becomes 500. Generate lighter (50-400) and darker (600-950) variants around it.
- **Status colors:** Minimal ramps (50, 500, 900) for red/green/amber. Enough for bg-tint + foreground + dark-mode.
- **Spacing/radii primitives:** A superset scale. Semantic tokens pick from this scale.

**Avoid the AI default look.** Left unconstrained, language models converge on the same handful of "tasteful" choices — which is exactly what makes generated design systems look generated. Two ban lists apply whenever YOU are inventing or deriving a choice:

- **Banned as invented display/heading faces:** Space Grotesk, Playfair Display, Fraunces, Instrument Serif, DM Serif Display, DM Serif Text — and Inter used as a display/heading face. These are the statistical defaults, not decisions. Pick from a wider pool instead: Geist, Satoshi, Cabinet Grotesk, General Sans, Hanken Grotesk, Manrope, Bricolage Grotesque, Newsreader, Spectral, IBM Plex Serif, Source Serif 4, Libre Caslon Text, Zodiak — or anything else that's genuinely motivated by the brand. (Satoshi, Cabinet Grotesk, General Sans and Zodiak load from Fontshare; the rest are on Google Fonts.)
- **Banned as invented genre palettes:** premium → beige + brass + oxblood; tech/SaaS → violet glow on near-black (the `#5E6AD2` family); fintech → navy + teal; wellness → sage + cream. If your palette for a fictional brand lands on one of these, you didn't derive it — you defaulted to it. Go back to the brief and find what's specific.

**The nuance that matters:** these bans apply ONLY to invented or derived decisions — fallback kits, fictional brands, description-only briefs. If the real analyzed brand demonstrably uses Inter as its headline face or ships a sage-and-cream palette, the skill documents reality. `observed_style` always wins over the ban list. The bans exist to stop YOU from defaulting, not to overrule a brand.

`scripts/validate.mjs` cross-checks this: it emits a WARN when a banned font heads the display stack of a generated skill. The WARN is a prompt to justify, not an automatic failure.

Write the YAML first. Then generate all other files by reading from it. This ensures tokens.md, components.md, platform-mapping.md, and preview.html all use the exact same values.
