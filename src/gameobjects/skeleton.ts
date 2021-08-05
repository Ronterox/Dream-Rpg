import { SPRITE_KEYS } from "../game-variables";
import { GameObjects, Physics } from "./gameobjects-components";
import { Scene } from "phaser";
import { IPosition, TextStyle } from "../scripts/scripts-components";
import { enable } from "../scripts/utilities";

type AnimationFrame =
  {
    startFrame: number,
    endFrame: number,
    frameRate: number,
    loop: boolean
  }

interface ISkeletonAnimations
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

const anims: ISkeletonAnimations = {
  idleUp: {
    startFrame: 0,
    endFrame: 3,
    frameRate: 8,
    loop: true
  },
  idleDown: {
    startFrame: SPRITE_ROW_OFFSET,
    endFrame: 3 + SPRITE_ROW_OFFSET,
    frameRate: 8,
    loop: true
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

export class Skeleton extends Physics.Arcade.Sprite
{
  private readonly speed: number;
  private targetPosition: IPosition;
  public _fire: Physics.Arcade.Sprite;

  private _animationDirection: string = 'Up';
  private _targetTile?: GameObjects.Image;
  private isMoving = false;

  //TODO: part of copy pasted code from zombie
  private _health: number = 100;
  private damageText: GameObjects.Text;

  constructor(scene: Scene, x = scene.cameras.main.centerX, y = scene.cameras.main.centerY, speed = 2)
  {
    super(scene, x, y, SPRITE_KEYS.skeleton);
    this.name = "Player";
    this.speed = speed;
    this.targetPosition = { x, y };
    this.setDepth(y + 64).setAnimations();

    scene.physics.add.existing(scene.add.existing(this));
    this.body.setSize(this.width * .5, this.height * .5);
    this.setPushable(false);

    this._fire = scene.physics.add.sprite(this.x, this.y, SPRITE_KEYS.fire);
    this._fire.setScale(.25, .25).name = "Fire Spell";

    //TODO: part of copy pasted code
    this.damageText = scene.add.text(this.x, this.y, '', { fontSize: '35px', fill: 'red' } as TextStyle);

    this.activateFire(false);
  }

  public playDirectionalAnimation(animation: string)
  {
    this.play(animation + this._animationDirection, true);
  }

  private setAnimations()
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

    this.playDirectionalAnimation('idle');
  }

  public activateFire(activate: boolean = true)
  {
    const fire = this._fire;
    enable(fire, activate);
    // @ts-ignore
    fire.body.setEnable(activate);

    if (activate)
    {
      const x = this.x, y = this.y;
      fire.setPosition(x, y);

      const closestEnemy = this.scene.physics.closest(this) as Physics.Arcade.Body;
      //TODO: check what happened to shoot animation
      if (closestEnemy) fire.setVelocity(closestEnemy.x - x, closestEnemy.y - y).setDepth(y * 2).play('shoot', true);
    }
  }

  //TODO: reused this code instead of copy paste
  public takeDamage(damagerPosition: IPosition, damage: number)
  {
    const { x: damagerX, y: damagerY } = damagerPosition;

    //TODO: this should be the enemy weapon
    const knockbackForce = 2;
    this.setDrag(0.1);

    this.setDamping(true);
    setInterval(() => this.setDamping(false), 1000);

    this.setVelocity((this.x - damagerX) * knockbackForce, (this.y - damagerY) * knockbackForce);

    this._health -= damage;

    //TODO: tween an animation
    this.damageText.setPosition(this.x, this.y).setText(`-${damage}`).setDepth(this.y * 2);

    const camera = this.scene.cameras.main;
    if (this._health <= 0)
    {
      //TODO: Create disable method for all gameobjects
      camera.flash(100);
      enable(this, false);
    }

    camera.shake(100);
  }

  public clearTargetTile()
  {
    if (this._targetTile)
    {
      this._targetTile.clearAlpha();
      this._targetTile = undefined;

      //Can also use stop() if changing acceleration and other things
      this.setVelocity(0, 0).playDirectionalAnimation('idle');
      this.isMoving = false;
    }
  }

  public setTarget(tile: GameObjects.Image)
  {
    this.clearTargetTile();

    this._targetTile = tile;
    this._targetTile.setAlpha(0.2);

    this.targetPosition = { x: tile.x, y: tile.y };
    this.isMoving = true;

    const speed = 200;

    //TODO: obviously change this
    const angle = Phaser.Math.Angle.BetweenPoints({ x: this.x, y: this.y }, this.targetPosition);
    const velocity = { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed };

    // N -3, S 0.8, E 0 W 2.3
    // NE -1.6, NW 3, SE 0.4, SW 1.6

    const north = -3, south = 0.8, east = 0, west = 2.3, northEast = -1.6, northWest = 3, southEast = 0.4, southWest = 1.6;

    const isLookingAtDirection = (direction) =>
    {
      const tolerance = 0.2;
      return Math.abs(direction - angle) <= tolerance;
    }

    if (isLookingAtDirection(north) || isLookingAtDirection(northWest))
    {
      this._animationDirection = 'Up';
      this.flipX = false;
    }
    else if (isLookingAtDirection(south) || isLookingAtDirection(southWest))
    {
      this._animationDirection = 'Down';
      this.flipX = false;
    }
    else if (isLookingAtDirection(east) || isLookingAtDirection(northEast))
    {
      this._animationDirection = 'Up';
      this.flipX = true;
    }
    else if (isLookingAtDirection(west) || isLookingAtDirection(southEast))
    {
      this._animationDirection = 'Down';
      this.flipX = true;
    }

    this.setVelocity(velocity.x, velocity.y).playDirectionalAnimation('walk');
  }

  public update()
  {
    if (!this.isMoving) return;

    //TODO: check for a change if this function is slow
    if (Phaser.Math.Distance.BetweenPoints(this.targetPosition, { x: this.x, y: this.y }) <= this.width * .3) this.clearTargetTile();
    else this.depth = this.y + 64;
  }
}
