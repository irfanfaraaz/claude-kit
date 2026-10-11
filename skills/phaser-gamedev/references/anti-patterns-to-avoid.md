# Anti-Patterns to Avoid

Moved here word for word from SKILL.md, to keep SKILL.md short.

## Anti-Patterns to Avoid

❌ **Global State Soup**: Storing game state on `window` or module globals
**Why bad**: Untrackable bugs, scene transitions break state
**Better**: Use scene data, registries, or dedicated state managers

❌ **Loading in Create**: Loading assets in `create()` instead of `preload()`
**Why bad**: Assets may not be ready when referenced
**Better**: Always load in `preload()`, use Boot scene for all assets

❌ **Frame-Dependent Logic**: Using frame count instead of delta time
**Why bad**: Game speed varies with frame rate
**Better**: `this.speed * (delta / 1000)` for consistent movement

❌ **Physics Overkill**: Using Matter for simple platformer collisions
**Why bad**: Performance hit, unnecessary complexity
**Better**: Arcade physics handles 90% of 2D game needs

❌ **Monolithic Scenes**: One giant scene with all game logic
**Why bad**: Unmaintainable, hard to add features
**Better**: Separate scenes for menus, gameplay, UI overlays

❌ **Magic Numbers**: Hardcoded values scattered in code
**Why bad**: Impossible to balance, inconsistent
**Better**: Config objects, constants files

❌ **Ignoring Object Pooling**: Creating/destroying objects every frame
**Why bad**: Memory churn, garbage collection stutters
**Better**: Use groups with `setActive(false)` / `setVisible(false)`

❌ **Synchronous Asset Access**: Assuming assets load instantly
**Why bad**: Race conditions, undefined textures
**Better**: Chain scene starts, use load events

❌ **Assuming Spritesheet Frame Dimensions**: Using guessed frame sizes without verifying
**Why bad**: Wrong dimensions cause silent frame corruption; off-by-pixels compounds into broken visuals
**Better**: Open asset file, measure frames, calculate with spacing/margin, verify math adds up

❌ **Ignoring Spritesheet Spacing**: Not specifying `spacing` for gapped spritesheets
**Why bad**: Frames shift progressively; later frames read wrong pixel regions
**Better**: Check source asset for gaps between frames; use `spacing: N` in loader config

❌ **Hardcoding Nine-Slice Colors**: Using single background color for all UI panel variants
**Why bad**: Transparent frame edges reveal wrong color for different asset color schemes
**Better**: Per-asset background color config; sample from center frame (frame 4)

❌ **Nine-Slice with Padded Frames**: Treating the full frame as the slice region when the art is centered/padded inside each tile
**Why bad**: Edge tiles contribute interior fill, showing up as opaque “side bars” inside the panel
**Better**: Trim tiles to their effective content bounds (alpha bbox) and composite/cache a texture; add ~1px overlap + disable smoothing to avoid seams

❌ **Scaling Discontinuous UI Art**: Stretching a cropped ribbon/banner row that contains internal transparent gaps
**Why bad**: The transparent gutters get stretched, so the UI looks segmented or the fill disappears behind the frame.
**Better**: Slice the asset into caps/center, stretch only the center, and stitch the pieces (with ~1px overlap + smoothing disabled) before rendering at pivot sizes.
