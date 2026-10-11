---
name: phaser-gamedev
description: >
  Build 2D games with Phaser 3 framework. Covers scene lifecycle, sprites, physics (Arcade/Matter),
  tilemaps, animations, input handling, and game architecture. Trigger: "create phaser game",
  "add phaser scene", "phaser sprite", "phaser physics", "game development with phaser".
---

# Phaser Game Development

Build fast, polished 2D browser games using Phaser 3's scene-based architecture and physics systems.

## Philosophy: Games as Living Systems

Games are not static UIs—they are **dynamic systems** where entities interact, state evolves, and player input drives everything. Before writing code, think architecturally.

**Before building, ask**:
- What **scenes** does this game need? (Boot, Menu, Game, Pause, GameOver)
- What **entities** exist and how do they interact?
- What **state** must persist across scenes?
- What **physics** model fits? (Arcade for speed, Matter for realism)
- What **input methods** will players use?

**Core principles**:
1. **Scene-First Architecture**: Structure games around scenes, not global state
2. **Composition Over Inheritance**: Build entities from game objects and components
3. **Physics-Aware Design**: Choose physics system before coding collisions
4. **Asset Pipeline Discipline**: Preload everything, reference by key
5. **Frame-Rate Independence**: Use delta time, not frame counting

---

## Game Configuration

Every Phaser game starts with a configuration object.

### Minimal Configuration

```javascript
const config = {
  type: Phaser.AUTO,           // WebGL with Canvas fallback
  width: 800,
  height: 600,
  scene: [BootScene, GameScene]
};

const game = new Phaser.Game(config);
```

### Full Configuration Pattern

```javascript
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',    // DOM element ID
  backgroundColor: '#2d2d2d',

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },

  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false              // Enable during development
    }
  },

  scene: [BootScene, MenuScene, GameScene, GameOverScene]
};
```

### Physics System Choice

| System | Use When |
|--------|----------|
| **Arcade** | Platformers, shooters, most 2D games. Fast, simple AABB collisions |
| **Matter** | Physics puzzles, ragdolls, realistic collisions. Slower, more accurate |
| **None** | Menu scenes, visual novels, card games |

---

## Scene Architecture

Moved to `references/scene-architecture.md`. Open it when the task needs this part.


## Game Objects

Everything visible in Phaser is a Game Object.

### Common Game Objects

```javascript
// Images (static)
this.add.image(400, 300, 'background');

// Sprites (can animate, physics-enabled)
const player = this.add.sprite(100, 100, 'player');

// Text
const score = this.add.text(16, 16, 'Score: 0', {
  fontSize: '32px',
  fill: '#fff'
});

// Graphics (draw shapes)
const graphics = this.add.graphics();
graphics.fillStyle(0xff0000);
graphics.fillRect(100, 100, 50, 50);

// Containers (group objects)
const container = this.add.container(400, 300, [sprite1, sprite2]);

// Tilemaps
const map = this.make.tilemap({ key: 'level1' });
```

### Sprite Creation Patterns

```javascript
// Basic sprite
const sprite = this.add.sprite(x, y, 'textureKey');

// Sprite with physics body
const sprite = this.physics.add.sprite(x, y, 'textureKey');

// From spritesheet frame
const sprite = this.add.sprite(x, y, 'sheet', frameIndex);

// From atlas
const sprite = this.add.sprite(x, y, 'atlas', 'frameName');
```

---

## Physics Systems

Moved to `references/physics-systems.md`. Open it when the task needs this part.


## Input Handling

### Keyboard Input

```javascript
// Cursor keys
this.cursors = this.input.keyboard.createCursorKeys();

// In update()
if (this.cursors.left.isDown) {
  player.setVelocityX(-160);
} else if (this.cursors.right.isDown) {
  player.setVelocityX(160);
}

if (this.cursors.up.isDown && player.body.touching.down) {
  player.setVelocityY(-330);  // Jump
}

// Custom keys
this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

// Key events
this.input.keyboard.on('keydown-SPACE', () => {
  this.fire();
});
```

### Pointer/Mouse Input

```javascript
// Click/tap
this.input.on('pointerdown', (pointer) => {
  console.log(pointer.x, pointer.y);
});

// Make object interactive
sprite.setInteractive();
sprite.on('pointerdown', () => {
  sprite.setTint(0xff0000);
});
sprite.on('pointerup', () => {
  sprite.clearTint();
});

// Drag
this.input.setDraggable(sprite);
this.input.on('drag', (pointer, obj, dragX, dragY) => {
  obj.x = dragX;
  obj.y = dragY;
});
```

---

## Animations

### Creating Animations

```javascript
// In create() - define once
this.anims.create({
  key: 'walk',
  frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
  frameRate: 10,
  repeat: -1  // Loop forever
});

this.anims.create({
  key: 'jump',
  frames: [{ key: 'player', frame: 4 }],
  frameRate: 20
});

// From atlas
this.anims.create({
  key: 'explode',
  frames: this.anims.generateFrameNames('atlas', {
    prefix: 'explosion_',
    start: 1,
    end: 8,
    zeroPad: 2
  }),
  frameRate: 16,
  hideOnComplete: true
});
```

### Playing Animations

```javascript
// Play animation
sprite.anims.play('walk', true);  // true = ignore if already playing

// Play once
sprite.anims.play('jump');

// Stop
sprite.anims.stop();

// Animation events
sprite.on('animationcomplete', (anim, frame) => {
  if (anim.key === 'die') {
    sprite.destroy();
  }
});
```

---

## Asset Loading

Moved to `references/asset-loading.md`. Open it when the task needs this part.


## Tilemaps (Tiled Integration)

### Loading and Creating

```javascript
preload() {
  this.load.tilemapTiledJSON('map', 'assets/map.json');
  this.load.image('tiles', 'assets/tileset.png');
}

create() {
  const map = this.make.tilemap({ key: 'map' });
  const tileset = map.addTilesetImage('tileset-name-in-tiled', 'tiles');

  // Create layers (match names from Tiled)
  const backgroundLayer = map.createLayer('Background', tileset, 0, 0);
  const groundLayer = map.createLayer('Ground', tileset, 0, 0);

  // Enable collision on specific tiles
  groundLayer.setCollisionByProperty({ collides: true });
  // Or by tile index
  groundLayer.setCollisionBetween(1, 100);

  // Add collision with player
  this.physics.add.collider(this.player, groundLayer);
}
```

### Object Layers

```javascript
// Spawn points from Tiled object layer
const spawnPoint = map.findObject('Objects', obj => obj.name === 'spawn');
this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'player');

// Create objects from layer
const coins = map.createFromObjects('Objects', {
  name: 'coin',
  key: 'coin'
});
this.physics.world.enable(coins);
```

---

## Project Structure

### Recommended Organization

```
game/
├── src/
│   ├── scenes/
│   │   ├── BootScene.js
│   │   ├── MenuScene.js
│   │   ├── GameScene.js
│   │   └── UIScene.js
│   ├── gameObjects/
│   │   ├── Player.js
│   │   ├── Enemy.js
│   │   └── Collectible.js
│   ├── systems/
│   │   ├── InputManager.js
│   │   └── AudioManager.js
│   ├── config/
│   │   └── gameConfig.js
│   └── main.js
├── assets/
│   ├── images/
│   ├── audio/
│   ├── tilemaps/
│   └── fonts/
├── index.html
└── package.json
```

### ES Module Setup

```javascript
// main.js
import Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import GameScene from './scenes/GameScene';
import { gameConfig } from './config/gameConfig';

const config = {
  ...gameConfig,
  scene: [BootScene, GameScene]
};

new Phaser.Game(config);
```

---

## Anti-Patterns to Avoid

Moved to `references/anti-patterns-to-avoid.md`. Open it when the task needs this part.


## Variation Guidance

**IMPORTANT**: Game implementations should vary based on:

- **Game Genre**: Platformer physics differ from top-down shooter physics
- **Target Platform**: Mobile needs touch input, desktop can use keyboard
- **Art Style**: Pixel art uses nearest-neighbor scaling, HD art uses linear
- **Performance Needs**: Many sprites → object pooling; few sprites → simple creation
- **Complexity**: Simple games can inline; complex games need class hierarchies

**Avoid converging on**:
- Always using 800x600 resolution
- Always using Arcade physics
- Always using the same scene structure
- Copy-pasting boilerplate without adaptation

---

## Quick Reference

### Common Physics Properties

```javascript
body.setVelocity(x, y)
body.setVelocityX(x)
body.setBounce(x, y)
body.setGravityY(y)
body.setCollideWorldBounds(true)
body.setImmovable(true)        // For static-like dynamic bodies
body.setDrag(x, y)
body.setMaxVelocity(x, y)
```

### Useful Scene Properties

```javascript
this.cameras.main              // Main camera
this.physics.world             // Physics world
this.input.keyboard            // Keyboard manager
this.sound                     // Audio manager
this.time                      // Time/clock manager
this.tweens                    // Tween manager
this.anims                     // Animation manager
this.registry                  // Cross-scene data store
this.data                      // Scene-specific data store
```

### Essential Events

```javascript
// Scene events
this.events.on('pause', callback)
this.events.on('resume', callback)
this.events.on('shutdown', callback)

// Physics events
this.physics.world.on('worldbounds', callback)

// Game object events
sprite.on('destroy', callback)
sprite.on('animationcomplete', callback)
```

---

## See Also

- **references/arcade-physics.md** - Deep dive into Arcade physics
- **references/tilemaps.md** - Advanced tilemap techniques
- **references/performance.md** - Optimization strategies
- **references/spritesheets-nineslice.md** - Spritesheet loading (spacing/margin), nine-slice UI panels, asset inspection

---

## Remember

Phaser gives you powerful primitives—scenes, sprites, physics, input—but **architecture is your responsibility**.

Think in systems: What scenes do you need? What entities exist? How do they interact? Answer these questions before writing code, and your game will be maintainable as it grows.

**Claude is capable of building complete, polished Phaser games. These guidelines illuminate the path—they don't fence it.**
