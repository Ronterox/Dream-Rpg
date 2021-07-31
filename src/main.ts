import { AUTO, Game } from 'phaser';
import { MainScene } from './scenes/main-scene';
import { WIN_HEIGHT, WIN_WIDTH } from "./game-config";
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin';
import RESIZE = Phaser.Scale.RESIZE;
import { UIScene } from "./scenes/ui-scene";

const config = {
  type: AUTO,
  width: WIN_WIDTH,
  height: WIN_HEIGHT,
  backgroundColor: '#000',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: false }
  },
  plugins: {
    scene: [{
      key: 'rexUI',
      plugin: UIPlugin,
      mapping: 'rexUI'
    }]
  },
  scale: { mode: RESIZE, autoCenter: RESIZE },
  scene: [MainScene, UIScene]
};

const game = new Game(config);
console.log('Game Started! ' + game.loop.actualFps);
