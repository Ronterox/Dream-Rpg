// noinspection ES6PreferShortImport
import { SPRITE_KEYS, WIN_HEIGHT, WIN_WIDTH } from "../game-config";
import { Scene } from "phaser";
import { Dialog } from 'phaser3-rex-plugins/templates/ui/ui-components.js';

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
    this.width *= .5;

    scene.physics.add.existing(scene.add.existing(this));
    this.body.setSize(this.width * .2, this.width * .5).setOffset(this.width * .5 + 25, this.width * .5 + 30);

    this.setImmovable().setInteractive().setScale(2, 2);

    //TODO: again check for other way of doing this
    this.on('pointerdown', () =>
    {
      this.setTint(5, 5, 5, 5)
    });
  }
}
