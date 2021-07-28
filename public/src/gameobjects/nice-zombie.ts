// noinspection ES6PreferShortImport
import { SPRITE_KEYS, WIN_HEIGHT, WIN_WIDTH } from "../game-config";
import { Scene } from "phaser";
// noinspection ES6PreferShortImport
import { MainScene } from "../scenes/main-scene";
// noinspection ES6PreferShortImport
import { SimpleTextBox } from "../gameobjects/ui/textbox";

//TODO: Generalize methods and interfaces from Skeleton class
//TODO: let zombie walk around
export class NiceZombie extends Phaser.Physics.Arcade.Sprite
{
  private dialogue: SimpleTextBox;
  private readonly speed: number;

  constructor(scene: Scene, group: Phaser.Physics.Arcade.Group, x = WIN_WIDTH * .5, y = WIN_HEIGHT * .5, speed = 2)
  {
    super(scene, x, y, SPRITE_KEYS.zombie);

    this.speed = speed;
    this.depth = y + 64;
    this.width *= .5;

    scene.add.existing(this);
    group.add(this)

    const halfWidth = this.width * .5;
    this.body.setSize(this.width * .2, halfWidth).setOffset(halfWidth + 25, halfWidth + 30);

    this.setImmovable().setInteractive().setScale(2, 2);

    //TODO: again check for other way of doing this
    //TODO: fix zombie hitbox
    //If you want look for another better way of pointer down event
    this.on('pointerdown', () =>
    {
      if (this.dialogue) this.dialogue.displayAndUpdate(true);
      else this.dialogue = new SimpleTextBox(scene as MainScene, "This is a long text. This is a long text. This is a long text. This is a long text. This is a long text. This is a long text. ");
    });
  }
}
