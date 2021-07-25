import { CANVAS, Game } from 'phaser';
import GameScene from "../scenes/game-scene";

const WIN_WIDTH = 800;
const WIN_HEIGHT = 600;

const config : Phaser.Types.Core.GameConfig = {
  type: CANVAS,
  width: WIN_WIDTH,
  height: WIN_HEIGHT,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: GameScene
};

// noinspection JSUnusedLocalSymbols
const game = new Game(config);
