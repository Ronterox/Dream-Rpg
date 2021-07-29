// noinspection ES6PreferShortImport
import { SPRITE_KEYS, WIN_HEIGHT, WIN_WIDTH } from "../game-config";
import { Scene } from "phaser";
// noinspection ES6PreferShortImport
import { Skeleton } from "./skeleton";

//TODO: Generalize methods and interfaces from Skeleton class
//TODO: let zombie walk around
export class Zombie extends Phaser.Physics.Arcade.Sprite
{
  private readonly speed: number;
  //TODO: obviously generalize this player with a tag
  public player: Skeleton;
  //TODO: Where is max health dude, and everything else about the defense/dodging etc
  private _health: number = 100;

  constructor(scene: Scene, x = WIN_WIDTH * .5, y = WIN_HEIGHT * .5, speed = 2)
  {
    super(scene, x, y, SPRITE_KEYS.zombie);

    this.speed = speed;
    this.depth = y + 64;

    this.setInteractive().input.hitArea.setTo(this.width * .25, this.height * .25, 60, 60);
    this.setTint(0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00);

    this.on('pointerdown', () =>
    {
      if (this.body.touching)
      {
        //TODO: check if player is on collision with tag
        const { x: playerX, y: playerY, width: playerWidth } = this.player;
        if (Phaser.Math.Distance.Between(this.x, this.y, playerX, playerY) < playerWidth)
        {
          //TODO: this should be the enemy weapon
          const knockbackForce = 2;
          this.setDrag(0.1);
          this.setDamping(true);
          this.setVelocity((this.x - playerX) * knockbackForce, (this.y - playerY) * knockbackForce);

          this._health -= Phaser.Math.Between(25, 50);

          if (this._health <= 0)
          {
            //TODO: Create disable method for all gameobjects
            this.destroy();
          }
        }
      }
    });

    scene.add.existing(this);
  }

  setCollider()
  {
    const height = this.width * .5;
    this.setSize(this.width * .25, height);
    this.setImmovable();
  }
}
