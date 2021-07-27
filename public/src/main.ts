import { AUTO, Game } from 'phaser';
import { MainScene } from './scenes/main-scene';
import { WIN_HEIGHT, WIN_WIDTH } from "./game-config";
import RESIZE = Phaser.Scale.RESIZE;

const config = {
  type: AUTO,
  width: WIN_WIDTH,
  height: WIN_HEIGHT,
  backgroundColor: '#000',
  physics:
    {
      default: 'arcade',
      arcade:
        {
          gravity: { y: 0 },
          debug: true
        }
    },
  scale: {
    mode: RESIZE,
    autoCenter: RESIZE
  },
  scene: [MainScene]
};

new Game(config);
