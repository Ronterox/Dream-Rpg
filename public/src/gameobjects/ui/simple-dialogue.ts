import { Dialog } from "phaser3-rex-plugins/templates/ui/ui-components.js";
import { Scene } from "phaser";
// noinspection ES6PreferShortImport
import { MainScene } from "../../scenes/main-scene";

const createLabel = function (scene: MainScene, text: string = "No Text")
{
  return scene.rexUI.add.label({
    width: 40, // Minimum width of round-rectangle
    height: 40, // Minimum height of round-rectangle

    background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x5e92f3),

    text: scene.add.text(0, 0, text, {
      fontSize: '24px'
    }),

    space: {
      left: 10,
      right: 10,
      top: 10,
      bottom: 10
    }
  });
};

function getDefaultConfig(scene: MainScene): Dialog.IConfig
{
  return {
    x: 400,
    y: 300,
    width: 500,

    background: scene.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x1565c0),

    title: createLabel(scene, 'Speaking to Mr. Zombie'),

    toolbar: [createLabel(scene, 'X')],

    choices: [
      createLabel(scene, 'Howdy'),
      createLabel(scene, 'Hello'),
      createLabel(scene, 'How is it going?')
    ],

    space: {
      left: 20,
      right: 20,
      top: -20,
      bottom: -20,

      title: 25,
      titleLeft: 30,
      content: 25,
      description: 25,
      descriptionLeft: 20,
      descriptionRight: 20,
      choices: 25,

      toolbarItem: 5,
      choice: 15,
      action: 15,
    },

    expand: {
      title: false,
      // content: false,
      // description: false,
      // choices: false,
      // actions: true,
    },

    align: {
      title: 'center',
      // content: 'left',
      // description: 'left',
      // choices: 'left',
      actions: 'right', // 'center'|'left'|'right'
    },

    click: {
      mode: 'release'
    }
  };
}

export class SimpleDialogue extends Dialog
{
  public onQuit: () => void;

  constructor(scene: MainScene, config: Dialog.IConfig = getDefaultConfig(scene))
  {
    super(scene, config);
    this.setDesign();
    this.setInteractions(scene);
    this.addAnimations(scene);
  }

  setDesign()
  {
    // const graphics = scene.add.graphics();
    // graphics.setDepth(999);
    this.setDraggable('background')   // Draggable-background
      .layout()
      // .drawBounds(graphics, 0xff0000)
      .popUp(1000).setDepth(1000);
  }

  setInteractions(scene: Scene)
  {
    const print = scene.add.text(0, 0, '');

    //TODO: find which type of button is this
    //TODO: find a better way of detecting choices
    this.on('button.click', (button, groupName: string, index: number) =>
    {
      if (button.text === 'X')
      {
        this.displayAndUpdate(false);
        this.onQuit();
      }
      print.text += groupName + '-' + index + ': ' + button.text + '\n';
    })
      .on('button.over', (button) => button.getElement('background').setStrokeStyle(1, 0xffffff))
      .on('button.out', (button) => button.getElement('background').setStrokeStyle());
  }

  displayAndUpdate(condition: boolean)
  {
    this.setActive(condition);
    this.setVisible(condition);
  }

  addAnimations(scene: Scene)
  {
    scene.tweens.add({
      targets: this,
      scaleX: 1,
      scaleY: 1,
      ease: 'Bounce', // 'Cubic', 'Elastic', 'Bounce', 'Back'
      duration: 1000,
      repeat: 0, // -1: infinity
      yoyo: false
    });
  }
}
