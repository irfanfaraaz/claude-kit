# Scene Architecture

Moved here word for word from SKILL.md, to keep SKILL.md short.

## Scene Architecture

Scenes are the fundamental organizational unit. Each scene has a lifecycle.

### Scene Lifecycle Methods

```javascript
class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');        // Scene key for reference
  }

  init(data) {
    // Called first. Receive data from previous scene
    this.level = data.level || 1;
  }

  preload() {
    // Load assets. Runs before create()
    this.load.image('player', 'assets/player.png');
    this.load.spritesheet('enemy', 'assets/enemy.png', {
      frameWidth: 32, frameHeight: 32
    });
  }

  create() {
    // Set up game objects, physics, input
    this.player = this.physics.add.sprite(100, 100, 'player');
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update(time, delta) {
    // Game loop. Called every frame
    // delta = milliseconds since last frame
    this.player.x += this.speed * (delta / 1000);
  }
}
```

### Scene Transitions

```javascript
// Start a new scene (stops current)
this.scene.start('GameOverScene', { score: this.score });

// Launch scene in parallel (both run)
this.scene.launch('UIScene');

// Pause/resume scenes
this.scene.pause('GameScene');
this.scene.resume('GameScene');

// Stop a scene
this.scene.stop('UIScene');
```

### Recommended Scene Structure

```
scenes/
├── BootScene.js      # Asset loading, progress bar
├── MenuScene.js      # Title screen, options
├── GameScene.js      # Main gameplay
├── UIScene.js        # HUD overlay (launched parallel)
├── PauseScene.js     # Pause menu overlay
└── GameOverScene.js  # End screen, restart option
```
