# Asset Loading

Moved here word for word from SKILL.md, to keep SKILL.md short.

## Asset Loading

### Preload Patterns

```javascript
preload() {
  // Images
  this.load.image('sky', 'assets/sky.png');

  // Spritesheets
  this.load.spritesheet('player', 'assets/player.png', {
    frameWidth: 32,
    frameHeight: 48
  });

  // Atlases (TexturePacker)
  this.load.atlas('sprites', 'assets/sprites.png', 'assets/sprites.json');

  // Tilemaps
  this.load.tilemapTiledJSON('map', 'assets/level1.json');
  this.load.image('tiles', 'assets/tileset.png');

  // Audio
  this.load.audio('bgm', 'assets/music.mp3');
  this.load.audio('sfx', ['assets/sound.ogg', 'assets/sound.mp3']);

  // Progress tracking
  this.load.on('progress', (value) => {
    console.log(`Loading: ${Math.round(value * 100)}%`);
  });
}
```

### Boot Scene Pattern

```javascript
class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Loading bar
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width/2 - 160, height/2 - 25, 320, 50);

    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(width/2 - 150, height/2 - 15, 300 * value, 30);
    });

    // Load all game assets here
    this.load.image('player', 'assets/player.png');
    // ... more assets
  }

  create() {
    this.scene.start('MenuScene');
  }
}
```
