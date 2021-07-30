import { Dialog } from "phaser3-rex-plugins/templates/ui/ui-components.js";
import { Scene } from "phaser";
// noinspection ES6PreferShortImport
import { MainScene } from "../../scenes/main-scene";
import { SimpleTextBox } from "./simple-textbox";

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

//TODO: Remove hardcoding of options and make it more dynamic
const option1 = 'I will kill all Zombies!';
const answer1 = 'I guess you are that smart aren\'t you';

const option2 = 'Hello Mr. Zombie, how are you?';
const answer2 = 'Well I\'m feeling really good even though I\'m half dead';

const option3 = 'Cool I guess...';
const answer3 = 'Yeah, pretty cool...';

function getDefaultConfig(scene: MainScene): Dialog.IConfig
{
  return {
    x: 400,
    y: 300,
    width: 500,

    background: scene.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x1565c0),

    // title: createLabel(scene, 'Speaking to Mr. NiceZombie'),

    toolbar: [createLabel(scene, 'X')],

    choices: [
      createLabel(scene, option1),
      createLabel(scene, option2),
      createLabel(scene, option3)
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
  //TODO: Change this insane connection between simple dialogue and textbox;
  public textBox: SimpleTextBox;

  constructor(scene: MainScene, config: Dialog.IConfig = getDefaultConfig(scene))
  {
    super(scene, config);
    this.setDesign();
    this.setInteractions();
    this.addAnimations();
    //TODO: move to another scene for static ui
    this.setScrollFactor(0);
  }

  private setDesign()
  {
    this.setDraggable('background')   // Draggable-background
      .layout()
      .popUp(1000).setDepth(1000);
  }

  private setInteractions()
  {
    const print = this.scene.add.text(0, 0, '');

    //TODO: find which type of button is this
    //TODO: find a better way of detecting choices
    this.on('button.click', (button, groupName: string, index: number) =>
    {
      //TODO: Change hardcode conversation
      switch (button.text)
      {
        case option1:
          //TODO: check why the start is not reusing the textbox and creating new things
          this.textBox.start(answer1, 10);
          break;
        case option2:
          this.textBox.start(answer2, 25);
          break;
        case option3:
          this.textBox.start(answer3, 50);
          break;
        default:
          this.textBox.start(Math.round(Math.random()) === 0 ? "Cya" : "Goodbye Friend", 50);
          this.textBox.onConversationEnd = () =>
          {
            this.textBox.displayAndUpdate(false);
            this.displayAndUpdate(false);
          }
          return;
      }
      this.displayAndUpdate(false);
      print.text += groupName + '-' + index + ': ' + button.text + '\n';
    })
      .on('button.over', (button) => button.getElement('background').setStrokeStyle(1, 0xffffff))
      .on('button.out', (button) => button.getElement('background').setStrokeStyle());
  }

  public displayAndUpdate(condition: boolean = true)
  {
    this.setActive(condition);
    this.setVisible(condition);
  }

  private addAnimations(scene: Scene = this.scene)
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
