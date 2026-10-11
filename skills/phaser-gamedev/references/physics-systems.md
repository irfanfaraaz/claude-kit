# Physics Systems

Moved here word for word from SKILL.md, to keep SKILL.md short.

## Physics Systems

### Arcade Physics (Recommended Default)

Fast, simple physics for most 2D games.

```javascript
// Enable physics on sprite
this.physics.add.sprite(x, y, 'player');

// Or add physics to existing sprite
this.physics.add.existing(sprite);

// Configure body
sprite.body.setVelocity(200, 0);
sprite.body.setBounce(0.5);
sprite.body.setCollideWorldBounds(true);
sprite.body.setGravityY(300);

// Collision detection
this.physics.add.collider(player, platforms);
this.physics.add.overlap(player, coins, collectCoin, null, this);

function collectCoin(player, coin) {
  coin.disableBody(true, true);  // Remove from physics and hide
  this.score += 10;
}
```

### Physics Groups

```javascript
// Static group (platforms, walls)
const platforms = this.physics.add.staticGroup();
platforms.create(400, 568, 'ground').setScale(2).refreshBody();

// Dynamic group (enemies, bullets)
const enemies = this.physics.add.group({
  key: 'enemy',
  repeat: 5,
  setXY: { x: 100, y: 0, stepX: 70 }
});

enemies.children.iterate(enemy => {
  enemy.setBounce(Phaser.Math.FloatBetween(0.4, 0.8));
});
```

### Matter Physics

For realistic physics simulations.

```javascript
// Config
physics: {
  default: 'matter',
  matter: {
    gravity: { y: 1 },
    debug: true
  }
}

// Create bodies
const ball = this.matter.add.circle(400, 100, 25);
const box = this.matter.add.rectangle(400, 400, 100, 50, { isStatic: true });

// Sprite with Matter body
const player = this.matter.add.sprite(100, 100, 'player');
player.setFriction(0.005);
player.setBounce(0.9);
```
