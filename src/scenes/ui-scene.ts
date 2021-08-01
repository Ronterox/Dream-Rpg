import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin";
import Label = RexUIPlugin.Label;
import { PluginScene, UI_SCENE_KEY, Scene } from "./scenes-components";
import { Skeleton, GameObjects } from "../gameobjects/gameobjects-components";
import { TextStyle } from "../scripts/scripts-components";

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

enum ButtonIndex { Spell, Chat }

export class UIScene extends PluginScene
{
  private fpsText: GameObjects.Text;
  private _player: Skeleton;
  private otherScene: Scene;

  private isChatOpen: boolean = false;

  constructor()
  {
    super(UI_SCENE_KEY);
  }

  // noinspection JSUnusedGlobalSymbols
  public init(data: { player: Skeleton, scene: Scene })
  {
    this._player = data.player;
    this.otherScene = data.scene;
  }

  public create()
  {
    this.fpsText = this.add.text(16, 16, "60 fps, 0 objects");
    this.createButtons();
  }

  public createButton(text: string = "", width = 100, height = 40, color: number = COLOR_LIGHT): Label
  {
    return this.rexUI.add.label({
      width,
      height,
      background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 20, color),
      text: this.add.text(0, 0, text, { fontSize: "18px" } as TextStyle),
      space: { left: 10, right: 10, }
    });
  }

  public createButtons()
  {
    const buttons = this.rexUI.add.buttons({
      x: 100, y: 300,
      orientation: 'y',
      buttons: [this.createButton('Spell'), this.createButton('Chat', 100, 40, COLOR_PRIMARY)],
      space: { item: 8 }
    }).layout();

    buttons.on('button.click', (button: Label, index: number) =>
    {
      switch (index)
      {
        case ButtonIndex.Spell:
          buttons.setButtonEnable(index, false);
          button.setAlpha(0.5);
          this._player.activateFire();

          setTimeout(() =>
          {
            buttons.setButtonEnable(index, true);
            this._player.activateFire(false);
            button.clearAlpha();
          }, 1000);
          break;
        case ButtonIndex.Chat:
          this.isChatOpen = !this.isChatOpen;
          break;
      }
    });
  }

  public update()
  {
    this.fpsText.setText(`${this.game.loop.actualFps.toFixed(2)} fps, ${this.children.list.length} UI objects, ${this.otherScene.children.list.length} Gameplay objects`);
  }
}
