// noinspection ES6PreferShortImport
import { SPRITE_KEYS, WIN_HEIGHT, WIN_WIDTH } from "../game-config";
import { Scene } from "phaser";

//TODO: Generalize methods and interfaces from Skeleton class
//TODO: let zombie walk around
export class Zombie extends Phaser.Physics.Arcade.Sprite
{
  private readonly speed: number;

  constructor(scene: Scene, x = WIN_WIDTH * .5, y = WIN_HEIGHT * .5, speed = 2)
  {
    super(scene, x, y, SPRITE_KEYS.zombie);

    this.speed = speed;
    this.depth = y + 64;

    this.setTint(0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00);

    scene.add.existing(this);
  }

  setCollider()
  {
    const halfWidth = this.width * .5;
    this.body.setSize(this.width * .25, halfWidth);
  }
}
