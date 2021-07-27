// noinspection ES6PreferShortImport
import { SPRITE_KEYS, WIN_HEIGHT, WIN_WIDTH } from "../game-config";
import { GameObjects, Scene } from "phaser";

//TODO: vector class
//But is okay to use something simple like interface here
interface Position
{
  x: number,
  y: number
}

type AnimationFrame =
  {
    startFrame: number,
    endFrame: number,
    frameRate: number,
    loop: boolean
  }

interface SkeletonAnimations
{
  idleUp: AnimationFrame,
  idleDown: AnimationFrame,
  walkUp: AnimationFrame
  walkDown: AnimationFrame
  attackUp: AnimationFrame,
  attackDown: AnimationFrame,
  die: AnimationFrame,
  shoot: AnimationFrame,
}

const SPRITE_ROW_OFFSET = 27 * 6;

const anims: SkeletonAnimations = {
  idleUp: {
    startFrame: 0,
    endFrame: 3,
    frameRate: 8,
    loop: false
  },
  idleDown: {
    startFrame: SPRITE_ROW_OFFSET,
    endFrame: 3 + SPRITE_ROW_OFFSET,
    frameRate: 8,
    loop: false
  },
  walkUp: {
    startFrame: 4,
    endFrame: 11,
    frameRate: 12,
    loop: true
  },
  walkDown: {
    startFrame: 4 + SPRITE_ROW_OFFSET,
    endFrame: 11 + SPRITE_ROW_OFFSET,
    frameRate: 12,
    loop: true
  },
  attackUp: {
    startFrame: 12,
    endFrame: 20,
    frameRate: 12,
    loop: false
  },
  attackDown: {
    startFrame: 12 + SPRITE_ROW_OFFSET,
    endFrame: 20 + SPRITE_ROW_OFFSET,
    frameRate: 12,
    loop: false
  },
  die: {
    startFrame: 20,
    endFrame: 28,
    frameRate: 12,
    loop: false
  },
  shoot: {
    startFrame: 28,
    endFrame: 32,
    frameRate: 12,
    loop: false
  }
};

export class Skeleton extends Phaser.Physics.Arcade.Sprite
{
  private readonly speed: number;
  private targetPosition: Position;
  private isMoving = false;

  private _animationDirection: string = 'Up';
  private _targetTile?: GameObjects.Image;

  constructor(scene: Scene, x = WIN_WIDTH * .5, y = WIN_HEIGHT * .5, speed = 2)
  {
    super(scene, x, y, SPRITE_KEYS.skeleton);

    this.speed = speed;
    this.depth = y + 64;
    this.targetPosition = { x, y };
    this.width *= .5;

    scene.physics.add.existing(this);
    scene.add.existing(this);

    this.body.setSize(this.width * .5, this.width)
    this.body.setOffset(this.width * .5 + 15, this.width * .5);

    this.awake();
  }

  awake()
  {
    this.setAnimations();
  }

  setAnimations()
  {
    for (const key in anims)
    {
      // noinspection JSUnfilteredForInLoop
      const animation = anims[key];

      // noinspection JSUnfilteredForInLoop
      this.anims.create({
        key: key,
        frames: this.anims.generateFrameNumbers(SPRITE_KEYS.skeleton, { start: animation.startFrame, end: animation.endFrame }),
        frameRate: animation.frameRate,
        repeat: animation.loop ? -1 : 0,
      });
    }
  }

  clearTargetTile()
  {
    if (this._targetTile)
    {
      this._targetTile.clearAlpha();
      this._targetTile = undefined;

      //Can also use stop() if changing acceleration and other things
      this.setVelocity(0, 0);
      this.isMoving = false;

      this.play('idle' + this._animationDirection);
    }
  }

  setTarget(tile: GameObjects.Image)
  {
    this.clearTargetTile();

    this._targetTile = tile;
    this._targetTile.setAlpha(0.2);

    this.targetPosition = { x: tile.x, y: tile.y };
    this.isMoving = true;

    const speed = 200;

    //TODO: obviously change this
    const angle = Phaser.Math.Angle.BetweenPoints({ x: this.x, y: this.y }, this.targetPosition);
    const direction = { x: Math.cos(angle), y: Math.sin(angle) }

    const velocity = { x: direction.x * speed, y: direction.y * speed };
    const x = Math.round(direction.x), y = Math.round(direction.y);

    //TODO: detect direction better
    if (x === -1 && y === -1)
    {
      //North
      this._animationDirection = 'Up';
    }
    else if (x === 1 && y === 1)
    {
      //South
      this._animationDirection = 'Down';
    }
    else if (x === 1 && y === 0)
    {
      //East
    }
    else if (x === -1 && y === 1)
    {
      //West
    }

    this.play('walk' + this._animationDirection, true);

    this.setVelocity(velocity.x, velocity.y);
  }

  update()
  {
    if (!this.isMoving) return;

    //TODO: check for a change if this function is slow
    if (Phaser.Math.Distance.BetweenPoints(this.targetPosition, { x: this.x, y: this.y }) <= this.width * .3) this.clearTargetTile();
    else this.depth = this.y + 64;
  }
}
