import { Dialog } from "phaser3-rex-plugins/templates/ui/ui-components.js";
import { Scene } from "phaser";
// noinspection ES6PreferShortImport
import { MainScene } from "../../scenes/main-scene";

const createLabel = function (scene: MainScene, text: string)
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

    title: createLabel(scene, 'Title'),

    toolbar: [
      createLabel(scene, 'O'),
      createLabel(scene, 'X')
    ],

    leftToolbar: [
      createLabel(scene, 'A'),
      createLabel(scene, 'B')
    ],

    content: createLabel(scene, 'Content'),

    description: createLabel(scene, 'Description'),

    choices: [
      createLabel(scene, 'Choice0'),
      createLabel(scene, 'Choice1'),
      createLabel(scene, 'Choice2')
    ],

    actions: [
      createLabel(scene, 'Action0'),
      createLabel(scene, 'Action1')
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

export class QuestDialogue extends Dialog
{
  constructor(scene: MainScene, config?: Dialog.IConfig)
  {
    super(scene, config ? config : getDefaultConfig(scene));
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
    this
      .on('button.click', (button, groupName, index, pointer, event) =>
      {
        print.text += groupName + '-' + index + ': ' + button.text + '\n';
      }, scene)
      .on('button.over', (button, groupName, index, pointer, event) =>
      {
        button.getElement('background').setStrokeStyle(1, 0xffffff);
      })
      .on('button.out', (button, groupName, index, pointer, event) =>
      {
        button.getElement('background').setStrokeStyle();
      });
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
