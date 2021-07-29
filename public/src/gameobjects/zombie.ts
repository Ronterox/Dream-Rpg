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
        //TODO: check if player is on collision
        const { x: playerX, y: playerY, width: playerWidth } = this.player;
        if (Phaser.Math.Distance.Between(this.x, this.y, playerX, playerY) < playerWidth * .5) this.setVelocity(50, 50);
      }
    });

    scene.add.existing(this);
  }

  setCollider()
  {
    const halfWidth = this.width * .5;
    this.body.setSize(this.width * .25, halfWidth);
    this.setImmovable();
  }
}
