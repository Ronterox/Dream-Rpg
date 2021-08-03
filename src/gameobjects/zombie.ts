import { SPRITE_KEYS } from "../game-config";
import { GameObjects, Skeleton } from "./gameobjects-components";
import { Scene } from "phaser";
import { IPosition, TextStyle } from "../scripts/scripts-components";
import { disable } from "../scripts/utilities";

//TODO: Generalize methods and interfaces from Skeleton class
//TODO: let zombie walk around
export class Zombie extends Phaser.Physics.Arcade.Sprite
{
  //TODO: Where is max health dude, and everything else about the defense/dodging etc
  private _health: number = 100;
  private damageText: GameObjects.Text;

  private _target: Skeleton;

  constructor(scene: Scene, x = scene.cameras.main.centerX, y = scene.cameras.main.centerY)
  {
    super(scene, x, y, SPRITE_KEYS.zombie);
    this.name = this.constructor["name"];

    this.setDepth(y + 64).setInteractive().input.hitArea.setTo(this.width * .25, this.height * .25, 60, 60);
    this.setTint(0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00);

    this.damageText = scene.add.text(this.x, this.y, '', { fontSize: '35px', fill: 'red' } as TextStyle);

    scene.add.existing(this);
  }

  protected preUpdate(time: number, delta: number)
  {
    if (this._target)
    {
      //TODO: don't call this infinite times
      const speed = 80;
      const angle = Phaser.Math.Angle.Between(this.x, this.y, this._target.x, this._target.y);
      const velocity = { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed };

      this.setVelocity(velocity.x, velocity.y);

      this.depth = this.y + 64;
    }

    super.preUpdate(time, delta);
  }

  public setPointerEvent(player: Skeleton)
  {
    this.on('pointerdown', () =>
    {
      if (this.body.touching)
      {
        //TODO: check if player is on collision with tag/name
        const { x: playerX, y: playerY, width: playerWidth } = player;
        if (Phaser.Math.Distance.Between(this.x, this.y, playerX, playerY) < playerWidth)
        {
          const damage = Phaser.Math.Between(25, 50);
          this.takeDamage(player, damage);
          if(!this._target)
          {
            this._target = player;
            //TODO: set on start collision do damage to player, as new collision
          }
        }

        player.playDirectionalAnimation('attack');
      }
    });
  }

  public takeDamage(damagerPosition: IPosition, damage: number)
  {
    const { x: damagerX, y: damagerY } = damagerPosition;

    //TODO: this should be the enemy weapon
    const knockbackForce = 2;
    this.setDrag(0.1);
    this.setDamping(true);
    this.setVelocity((this.x - damagerX) * knockbackForce, (this.y - damagerY) * knockbackForce);

    this._health -= damage;

    //TODO: tween an animation
    this.damageText.setPosition(this.x, this.y);
    this.damageText.setText(`-${damage}`);
    this.damageText.setDepth(this.y * 2);

    const camera = this.scene.cameras.main;
    if (this._health <= 0)
    {
      //TODO: Create disable method for all gameobjects
      camera.flash(100);
      disable(this);
    }

    camera.shake(100);
  }

  public setCollider()
  {
    const height = this.width * .5;
    this.setSize(this.width * .25, height);
    this.setPushable(false);
  }
}
