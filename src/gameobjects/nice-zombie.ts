import { WIN_HEIGHT, WIN_WIDTH } from "../game-config";
import { Zombie } from "./zombie";
import { SimpleDialogue, SimpleTextBox } from "./ui/ui-gameobjects-components";
import { PluginScene, Scene, UI_SCENE_KEY } from "../scenes/scenes-components";

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
        //TODO: make a function for this repeated code, use origin (0.5) instead
        const mainCamera = scene.cameras.main;
        const mainResizer = screen.orientation.type === "landscape-primary" ? mainCamera.centerX : mainCamera.centerY;

        const fixedHeight = mainResizer * .3, fixedWidth = mainResizer * .5;
        const wrapWidth = fixedWidth;

        const uiX = mainCamera.centerX - fixedWidth, uiY = mainCamera.centerY - fixedHeight;

        const uiScene = scene.game.scene.getScene(UI_SCENE_KEY) as PluginScene;

        //TODO: spawn all UIs on ui scene
        this.dialogue = new SimpleTextBox(uiScene, introduction, { x: uiX, y: uiY, wrapWidth, fixedWidth, fixedHeight });
        this.dialogue.onConversationEnd = () =>
        {
          //TODO: appear simple dialogue on canvas screen
          const optionSelection = new SimpleDialogue(uiScene);
          optionSelection.textBox = this.dialogue;
        }
      }
    });

    this.clearTint();
  }
}
