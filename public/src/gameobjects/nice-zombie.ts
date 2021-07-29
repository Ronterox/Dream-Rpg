// noinspection ES6PreferShortImport
import { WIN_HEIGHT, WIN_WIDTH } from "../game-config";
import { Scene } from "phaser";
// noinspection ES6PreferShortImport
import { MainScene } from "../scenes/main-scene";
// noinspection ES6PreferShortImport
import { SimpleTextBox } from "../gameobjects/ui/textbox";
// noinspection ES6PreferShortImport
import { Zombie } from "../gameobjects/zombie";

//TODO: Generalize methods and interfaces from Skeleton class
//TODO: let zombie walk around
export class NiceZombie extends Zombie
{
  private dialogue: SimpleTextBox;

  constructor(scene: Scene, x = WIN_WIDTH * .5, y = WIN_HEIGHT * .5, speed = 2)
  {
    super(scene, x, y, speed);

    this.setInteractive().setScale(2, 2);

    //TODO: again check for other way of doing this
    //TODO: fix zombie hitbox
    //If you want look for another better way of pointer down event
    this.on('pointerdown', () =>
    {
      if (this.dialogue) this.dialogue.displayAndUpdate(true);
      else this.dialogue = new SimpleTextBox(scene as MainScene, "This is a long text. This is a long text. This is a long text. This is a long text. This is a long text. This is a long text. ");
    });
  }

  setCollider()
  {
    // super.setCollider();
    this.setImmovable();
  }
}
