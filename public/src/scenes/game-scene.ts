import { Scene } from "phaser";
// @ts-ignore
import images from '../../assets/sprites/*.png';
import PhysicsType = Phaser.Physics.Arcade;
import GameObject = Phaser.GameObjects.GameObject;
import TextStyle = Phaser.Types.GameObjects.Text.TextStyle;

const IMG_SKY = 'sky';
const IMG_GROUND = 'ground';
const IMG_STAR = 'star';
const IMG_BOMB = 'bomb';
const SPRITE_DUDE = 'dude';

export default class GameScene extends Scene
{
  private player?: PhysicsType.Sprite;
  private bombs;

  private score = 0;
  private cursors;

  private scoreText;
  private fpsText;

  private gameOver;

  public preload()
  {
    const scene = this;

    scene.load.image(IMG_SKY, images.sky);
    scene.load.image(IMG_GROUND, images.platform);
    scene.load.image(IMG_STAR, images.star);
    scene.load.image(IMG_BOMB, images.bomb);
    scene.load.spritesheet(SPRITE_DUDE, images.dude, { frameWidth: 32, frameHeight: 48 });
  }

  public createPlatforms()
  {
    const platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, IMG_GROUND).setScale(2).refreshBody();

    platforms.create(600, 400, IMG_GROUND);
    platforms.create(50, 250, IMG_GROUND);
    platforms.create(750, 220, IMG_GROUND);

    return platforms;
  }

  public createPlayer()
  {
    const scene = this;

    const player = scene.physics.add.sprite(100, 450, SPRITE_DUDE);

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    scene.anims.create({
      key: 'left',
      frames: scene.anims.generateFrameNumbers(SPRITE_DUDE, { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1
    });

    scene.anims.create({
      key: 'turn',
      frames: [{ key: SPRITE_DUDE, frame: 4 }],
      frameRate: 20
    });

    scene.anims.create({
      key: 'right',
      frames: scene.anims.generateFrameNumbers(SPRITE_DUDE, { start: 5, end: 8 }),
      frameRate: 5,
      repeat: -1
    });

    return player;
  }

  public createStars()
  {
    const scene = this;

    const stars = scene.physics.add.group({
      key: IMG_STAR,
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate((child) => (child as unknown as PhysicsType.Body).setBounceY(Phaser.Math.FloatBetween(0.4, 0.8)));

    scene.physics.add.overlap((this.player as GameObject), stars, (player, star) =>
    {
      (star as PhysicsType.Image).disableBody(true, true);

      this.score += 10;
      this.scoreText.setText(`Score: ${this.score}`);

      if (stars.countActive(true) === 0)
      {
        stars.children.iterate((child) =>
        {
          const c = child as PhysicsType.Image;
          c.enableBody(true, c.x, 0, true, true)
        });

        const x = (player as PhysicsType.Sprite).x < 400 ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        const bomb = this.bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
      }

    }, undefined, this);

    return stars;
  }

  public create()
  {
    const scene = this;

    scene.add.image(0, 0, IMG_SKY).setOrigin(0, 0);

    const platforms = this.createPlatforms();
    this.player = this.createPlayer();
    const stars = this.createStars();

    scene.physics.add.collider(platforms, stars);
    scene.physics.add.collider(this.player, platforms);

    this.cursors = scene.input.keyboard.createCursorKeys();

    this.scoreText = scene.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' } as TextStyle);
    this.fpsText = scene.add.text(600, 16, '60 fps', { fontSize: '32px', fill: '#000' } as TextStyle);

    this.bombs = scene.physics.add.group();

    scene.physics.add.collider(this.bombs, platforms);
    scene.physics.add.collider(this.player, this.bombs, p =>
    {
      this.physics.pause();

      const player = p as PhysicsType.Sprite;

      player.setTint(0xff0000);

      player.anims.play('turn');

      this.gameOver = true;
    }, undefined, this);
  }

  public update()
  {
    this.fpsText.setText(`${this.game.loop.actualFps.toFixed(2)}fps`);

    if (this.gameOver) return;

    const player = this.player;
    if (!player) return;

    if (this.cursors.left.isDown)
    {
      player.setVelocityX(-160);
      player.anims.play('left', true);
    }
    else if (this.cursors.right.isDown)
    {
      player.setVelocityX(160);
      player.anims.play('right', true);
    }
    else
    {
      player.setVelocityX(0);
      player.anims.play('turn');
    }

    if (this.cursors.up.isDown && player.body.touching.down) player.setVelocityY(-330);
  }
}
