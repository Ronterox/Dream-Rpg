// noinspection ES6PreferShortImport
import { WIN_HEIGHT, WIN_WIDTH } from "../game-config";
import { Scene } from "phaser";
// noinspection ES6PreferShortImport
import { MainScene } from "../scenes/main-scene";
// noinspection ES6PreferShortImport
import { SimpleTextBox } from "./ui/simple-textbox";
// noinspection ES6PreferShortImport
import { Zombie } from "./zombie";
// noinspection ES6PreferShortImport
import { SimpleDialogue } from "./ui/simple-dialogue";

//TODO: Generalize methods and interfaces from Skeleton class
//TODO: let zombie walk around
export class NiceZombie extends Zombie
{
  private dialogue: SimpleTextBox;

  constructor(scene: Scene, x = WIN_WIDTH * .5, y = WIN_HEIGHT * .5, speed = 2)
  {
    super(scene, x, y, speed);
    this.name = "Nice Zombie";

    const introduction = "Hello I'm a friendly Zombie, and that other one is a not so friendly Zombie."

    //TODO: again check for other way of doing this
    //TODO: fix zombie hitbox
    //If you want look for another better way of pointer down event
    this.on('pointerdown', () =>
    {
      if (this.dialogue) this.dialogue.displayAndUpdate(true);
      else
      {
        const mainCamera = scene.cameras.main;
        const fixedHeight = 100;
        const fixedWidth = 500;
        this.dialogue = new SimpleTextBox(scene as MainScene, introduction, { x: mainCamera.centerX * .5 - fixedWidth, y: mainCamera.centerY - fixedHeight, wrapWidth: 500, fixedWidth, fixedHeight });
        this.dialogue.onConversationEnd = () =>
        {
          //TODO: appear simple dialogue on canvas screen
          const optionSelection = new SimpleDialogue(scene as MainScene);
          optionSelection.textBox = this.dialogue;
        }
      }
    });

    this.clearTint();
  }
}
