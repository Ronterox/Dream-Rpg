import * as Phaser from 'phaser';
// noinspection JSFileReferences
import images from '../img/*.png'

const WIN_WIDTH = 800;
const WIN_HEIGHT = 600;

const config = {
  type: Phaser.CANVAS,
  width: WIN_WIDTH,
  height: WIN_HEIGHT,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

// noinspection JSUnusedLocalSymbols
const game = new Phaser.Game(config);

const IMG_SKY = 'sky';
const IMG_GROUND = 'ground';
const IMG_STAR = 'star';
const IMG_BOMB = 'bomb';
const SPRITE_DUDE = 'dude';

function preload()
{
  this.load.image(IMG_SKY, images.sky);
  this.load.image(IMG_GROUND, images.platform);
  this.load.image(IMG_STAR, images.star);
  this.load.image(IMG_BOMB, images.bomb);
  this.load.spritesheet(SPRITE_DUDE, images.dude, { frameWidth: 32, frameHeight: 48 });
}

function createPlatforms(engine)
{
  const platforms = engine.physics.add.staticGroup();

  platforms.create(400, 568, IMG_GROUND).setScale(2).refreshBody();

  platforms.create(600, 400, IMG_GROUND);
  platforms.create(50, 250, IMG_GROUND);
  platforms.create(750, 220, IMG_GROUND);

  return platforms;
}

function createPlayer(engine)
{
  const player = engine.physics.add.sprite(100, 450, SPRITE_DUDE);

  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  engine.anims.create({
    key: 'left',
    frames: engine.anims.generateFrameNumbers(SPRITE_DUDE, { start: 0, end: 3 }),
    frameRate: 5,
    repeat: -1
  });

  engine.anims.create({
    key: 'turn',
    frames: [{ key: SPRITE_DUDE, frame: 4 }],
    frameRate: 20
  });

  engine.anims.create({
    key: 'right',
    frames: engine.anims.generateFrameNumbers(SPRITE_DUDE, { start: 5, end: 8 }),
    frameRate: 5,
    repeat: -1
  });

  return player;
}

function createStars(engine)
{
  const stars = engine.physics.add.group({
    key: IMG_STAR,
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
  });

  stars.children.iterate(child => child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8)));

  engine.physics.add.overlap(player, stars, (player, star) =>
  {
    star.disableBody(true, true);
    scoreText.setText('Score: ' + (score += 10));

    if (stars.countActive(true) === 0)
    {
      stars.children.iterate(child => child.enableBody(true, child.x, 0, true, true));

      const x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

      const bomb = bombs.create(x, 16, 'bomb');
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }

  }, null, this);

  return stars;
}

let cursors, player;

let score = 0;
let scoreText;

let fpsText;
let gameOver;
let bombs;

function create()
{
  const engine = this;

  engine.add.image(0, 0, IMG_SKY).setOrigin(0, 0);

  const platforms = createPlatforms(engine);
  player = createPlayer(engine);
  const stars = createStars(engine, player);

  engine.physics.add.collider(platforms, stars);
  engine.physics.add.collider(player, platforms);

  cursors = engine.input.keyboard.createCursorKeys();

  scoreText = engine.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
  fpsText = engine.add.text(600, 16, '60 fps', { fontSize: '32px', fill: '#000' });

  bombs = engine.physics.add.group();

  engine.physics.add.collider(bombs, platforms);
  engine.physics.add.collider(player, bombs, player =>
  {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
  }, null, this);
}

function update()
{
  fpsText.setText(`${this.game.loop.actualFps.toFixed(2)}fps`);

  if (gameOver) return;

  if (cursors.left.isDown)
  {
    player.setVelocityX(-160);
    player.anims.play('left', true);
  }
  else if (cursors.right.isDown)
  {
    player.setVelocityX(160);
    player.anims.play('right', true);
  }
  else
  {
    player.setVelocityX(0);
    player.anims.play('turn');
  }

  if (cursors.up.isDown && player.body.touching.down) player.setVelocityY(-330);
}
