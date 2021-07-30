import { PluginScene } from "./plugin-scene";
import { GameObjects, Scene } from "phaser";
import UIPlugins from "phaser3-rex-plugins/templates/ui/ui-plugin";
import Label = UIPlugins.Label;
import TextStyle = Phaser.Types.GameObjects.Text.TextStyle;
import { Skeleton } from "src/gameobjects/skeleton";

const UI_SCENE_KEY = 'ui';

class UIScene extends PluginScene
{
  private fpsText: GameObjects.Text;
  private _player: Skeleton;
  private otherScene: Scene;

  constructor()
  {
    super(UI_SCENE_KEY);
  }

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

  //TODO: understand this buttons and all ui to scene ui
  public createButtons()
  {
    const COLOR_PRIMARY = 0x4e342e;
    const COLOR_LIGHT = 0x7b5e57;
    const COLOR_DARK = 0x260e04;

    const createButton = (scene: PluginScene, text: string): Label => scene.rexUI.add.label({
      width: 100,
      height: 40,
      background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, COLOR_LIGHT),
      text: scene.add.text(0, 0, text, { fontSize: "18px" } as TextStyle),
      space: { left: 10, right: 10, }
    });

    const buttons = this.rexUI.add.buttons({
      x: 100, y: 300,
      orientation: 'y',
      buttons: [createButton(this, 'Spell')],
      space: { item: 8 }
    }).layout();

    buttons.on('button.click', (button: Label, index: number) =>
    {
      buttons.setButtonEnable(index, false);
      button.setAlpha(0.5);
      this._player.activateFire();

      setTimeout(() =>
      {
        buttons.setButtonEnable(index, true);
        this._player.activateFire(false);
        button.clearAlpha();
      }, 1000);
    });
  }

  public update()
  {
    this.fpsText.setText(`${this.game.loop.actualFps.toFixed(2)} fps, ${this.children.list.length + this.otherScene.children.list.length} objects`);
  }
}

export
{
  UIScene,
  UI_SCENE_KEY
}
