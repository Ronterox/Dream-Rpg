import { AUTO, Game } from 'phaser';
import { MainScene, UIScene } from "./scenes/scenes-components";
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin';
import RESIZE = Phaser.Scale.RESIZE;

const config = {
  type: AUTO,
  backgroundColor: '#000',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: true }
  },
  plugins: {
    scene: [{
      key: 'rexUI',
      plugin: RexUIPlugin,
      mapping: 'rexUI'
    }]
  },
  scale: { mode: RESIZE, autoCenter: RESIZE },
  scene: [MainScene, UIScene]
};

const game = new Game(config);
console.log('Game Started! ' + game.loop.actualFps);
