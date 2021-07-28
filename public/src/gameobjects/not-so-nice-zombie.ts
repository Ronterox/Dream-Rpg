// noinspection ES6PreferShortImport
import { SPRITE_KEYS, WIN_HEIGHT, WIN_WIDTH } from "../game-config";
import { Scene } from "phaser";

//TODO: heritage and single zombie class
export class NotSoNiceZombie extends Phaser.Physics.Arcade.Sprite
{
  private readonly speed: number;

  constructor(scene: Scene, group: Phaser.Physics.Arcade.Group, x = WIN_WIDTH * .5, y = WIN_HEIGHT * .5, speed = 2)
  {
    super(scene, x, y, SPRITE_KEYS.zombie);

    this.speed = speed;
    this.depth = y + 64;
    this.width *= .5;

    scene.add.existing(this);
    group.add(this);

    const halfWidth = this.width * .5;
    this.body.setSize(this.width * .2, halfWidth).setOffset(halfWidth + 25, halfWidth + 30);
  }
}
