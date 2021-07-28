import { GameObjects } from "phaser";
import { TextBox } from "phaser3-rex-plugins/templates/ui/ui-components";
// noinspection ES6PreferShortImport
import { MainScene } from "../../scenes/main-scene";
import GameObject = Phaser.GameObjects.GameObject;
import { SimpleDialogue } from "./simple-dialogue";

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

interface ISimpleTextBoxConfig
{
  x: number,
  y: number,
  wrapWidth: number,
  fixedWidth?: number,
  fixedHeight?: number
}

function getBBcodeText(scene: MainScene, wrapWidth: number, fixedWidth: number, fixedHeight: number): GameObject
{
  return scene.rexUI.add.BBCodeText(0, 0, '', {
    fixedWidth: fixedWidth,
    fixedHeight: fixedHeight,

    fontSize: '20px',
    wrap: {
      mode: 'word',
      width: wrapWidth
    },
    maxLines: 3
  })
}

function getDefaultTextBoxConfig(scene: MainScene, config: ISimpleTextBoxConfig): TextBox.IConfig
{
  const GetValue = Phaser.Utils.Objects.GetValue;

  //TODO: change this get if slow
  const wrapWidth = GetValue(config, 'wrapWidth', 0);
  const fixedWidth = GetValue(config, 'fixedWidth', 0);
  const fixedHeight = GetValue(config, 'fixedHeight', 0);

  return {
    x: config.x,
    y: config.y,

    background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_PRIMARY).setStrokeStyle(2, COLOR_LIGHT),

    icon: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_DARK),

    text: getBBcodeText(scene, wrapWidth, fixedWidth, fixedHeight),

    action: scene.add.image(0, 0, 'house').setTint(COLOR_LIGHT).setVisible(false),

    space: {
      left: 20,
      right: 20,
      top: 20,
      bottom: 20,
      icon: 10,
      text: 10,
    },

    page: {
      maxLines: 3
    }
  };
}

export class SimpleTextBox extends TextBox
{
  public optionsDialogue: SimpleDialogue;

  constructor(scene: MainScene, content = "No text", config: ISimpleTextBoxConfig = { x: 150, y: 150, wrapWidth: 500, fixedWidth: 500, fixedHeight: 100 })
  {
    super(scene, getDefaultTextBoxConfig(scene, config));

    this.setOrigin(0)
      .layout()
      .setInteractive()
      .on('pointerdown', () =>
      {
        const icon = (this.getElement('action') as GameObjects.Image).setVisible(false);
        this.resetChildVisibleState(icon);

        if (this.isTyping) this.stop(true);
        else this.typeNextPage();
      })
      .on('pageend', () =>
      {
        if (this.isLastPage)
        {
          if (this.optionsDialogue) this.optionsDialogue.displayAndUpdate(true);
          else
          {
            this.optionsDialogue = new SimpleDialogue(scene as MainScene);
            this.optionsDialogue.onQuit = () => this.displayAndUpdate(false);
          }
          return;
        }

        const icon = (this.getElement('action') as GameObjects.Image).setVisible(true);
        this.resetChildVisibleState(icon);
        icon.y -= 30;

        scene.tweens.add({
          targets: icon,
          y: '+=30', // '+=100'
          ease: 'Bounce', // 'Cubic', 'Elastic', 'Bounce', 'Back'
          duration: 500,
          repeat: 0, // -1: infinity
          yoyo: false
        });
      }).setDepth(1000).start(content, 25);
    //.on('type', function () {
    //})

    scene.add.existing(this);
  }

  displayAndUpdate(condition: boolean)
  {
    this.setVisible(condition);
    this.setActive(condition);

    if (condition && this.isLastPage) this.optionsDialogue?.displayAndUpdate(true);
  }
}
